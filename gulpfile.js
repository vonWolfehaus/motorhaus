var gulp = require('gulp');
var rjs = require('gulp-requirejs');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build', function() {
	rjs({
		baseUrl: 'src',
		name: 'core/Engine',
		include: ['components/VonComponents'],
		onBuildWrite: function(name, path, contents) {
			return require('amdclean').clean({
				code: contents,
				removeAllRequires: true,
				globalObject: true,
				globalObjectName: 'von'/*,
				globalModules: []*/
			});
		},
		out: 'von-component-min.js',
		// optimize: 'uglify2',
		// generateSourceMaps: true,
		// preserveLicenseComments: false,
		findNestedDependencies: true,
		wrap: false/*{
			startFile: 'wrapper/banner.js',
			endFile: 'wrapper/outro.js'
		}*/
	}) // thanks to rjs optimizer for sucking at optimizing, or at least the gulp plugin of it
		.pipe(uglify(/*{outSourceMap: true}*/)) 
		.pipe(gulp.dest('dist/'));
});

// don't include almond so requirejs can be used and everything is out in the open
gulp.task('debug', function() {
	rjs({
		baseUrl: 'src',
		name: 'core/Engine',
		out: 'von-component.js',
		include: ['components/VonComponents'],
		wrap: false
	})
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));
});

gulp.task('default', ['build']);