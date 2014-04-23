var gulp = require('gulp');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var fs = require('fs');

gulp.task('dev', function() {
	var these = ['components/VonComponents', 'physics/CollisionGrid',
				'utils/DebugDraw', 'utils/DOMTools', 'utils/DualPool', 'utils/Tools'];
	
	rjs({
		baseUrl: 'src',
		name: 'core/Engine',
		include: these,
		onBuildWrite: function(name, path, contents) {
			return require('amdclean').clean({
				code: contents,
				removeAllRequires: true,
				prefixTransform: function(moduleName) {
					return moduleName.substring(moduleName.lastIndexOf('_') + 1, moduleName.length);
				},
				globalObject: true,
				globalObjectName: 'von'/*,
				globalModules: []*/
			});
		},
		out: 'von-component.js',
		// optimize: 'uglify2', // thanks to rjs optimizer for sucking at optimizing, or at least the gulp plugin of it
		// generateSourceMaps: true,
		// preserveLicenseComments: false,
		findNestedDependencies: true,
		wrap: false/*{
			startFile: 'wrapper/banner.js',
			endFile: 'wrapper/outro.js'
		}*/
	})
		.pipe(gulp.dest('dist/'));
});

gulp.task('release', ['dev'], function() {
	var min = 'dist/von-component.min.js';
	if (fs.existsSync(min)) {
		fs.unlinkSync(min);
	}
	
	gulp.src('dist/von-component.js')
		.pipe(uglify(/*{ outSourceMap: true }*/))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/'));
});


gulp.task('default', ['release']);