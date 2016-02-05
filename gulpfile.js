var gulp = require('gulp');
var rjsOptimize = require('gulp-requirejs-optimize');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var fs = require('fs');
var del = require('del');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var dist = 'dist';
var src = 'src';

var glob = {
	scripts: [src+'/**/*.js']
};

/*----------------------------------------------------------------------
	MACRO
*/

gulp.task('default', ['scripts']);
gulp.task('clean', del.bind(null, [dist]));

/*----------------------------------------------------------------------
	SCRIPTS
*/

gulp.task('scripts', ['clean'], function() {
	var these = ['components/VonComponents', 'physics/CollisionGrid',
				'utils/DebugDraw', 'utils/DOMTools', 'utils/DualPool', 'utils/Tools'];
	return gulp.src(src+'/core/Engine.js')
		.pipe(plumber({errorHandler: handleErrors}))
		.pipe(sourcemaps.init())
		.pipe(rjsOptimize({
			baseUrl: src,
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
					globalObjectName: 'mh'/*,
					globalModules: []*/
				});
			},
			out: 'motorhaus.min.js',
			optimize: 'uglify2',
			preserveLicenseComments: false,
			findNestedDependencies: true,
			wrap: false/*{
				startFile: 'wrapper/intro.js',
				endFile: 'wrapper/outro.js'
			}*/
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dist))
		.pipe(browserSync.stream());
});

/*----------------------------------------------------------------------
	SERVER
*/

gulp.task('examples', function() {
	browserSync.init({
		notify: false,
		server: {
			baseDir: ['./', './examples'],
			index: './examples/index.html'
		}
	});

	browserSync.watch('examples/**/*.*').on('change', reload);
	browserSync.watch(dist+'/**/*.*').on('change', reload);
	gulp.watch(glob.scripts, ['scripts']);
});

/*----------------------------------------------------------------------
	HELPERS
*/

function handleErrors() {
	var args = Array.prototype.slice.call(arguments);
	// Send error to notification center with gulp-notify
	notify.onError({
		title: 'Build error',
		message: '<%= error%>',
		showStack: true
	}).apply(this, args);

	// Keep gulp from hanging on this task
	this.emit('end');
}
