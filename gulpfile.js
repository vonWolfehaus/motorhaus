var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var fs = require('fs');
var del = require('del');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var dist = 'dist';
var src = 'src';

var glob = {
	scripts: [src+'/core/motorhaus.js', src+'/**/*.js', '!'+src+'/extras/**/*.js'],
	extras: [src+'/extras/**/*.js']
};

/*______________________________________________________________________
	MACRO
*/

gulp.task('default', ['scripts']);
gulp.task('dev', ['scripts', /*'extras',*/ 'examples']);
gulp.task('clean', del.bind(null, [dist]));

/*______________________________________________________________________
	SCRIPTS
*/

gulp.task('scripts', ['clean'], function() {
	return gulp.src(glob.scripts)
		.pipe(plumber({errorHandler: handleErrors}))
		.pipe(eslint({ fix: true }))
		.pipe(eslint.formatEach())
		.pipe(eslint.failOnError())
		.pipe(sourcemaps.init())
		.pipe(concat('motorhaus.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dist))
		.pipe(browserSync.stream());
});

gulp.task('extras', function() {
	return gulp.src(glob.extras)
		.pipe(plumber({errorHandler: handleErrors}))
		// .pipe(eslint({ fix: true }))
		// .pipe(eslint.formatEach())
		// .pipe(eslint.failOnError())
		.pipe(sourcemaps.init())
		.pipe(concat('motorhaus-extras.min.js'))
		// .pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dist))
		.pipe(browserSync.stream());
});

/*______________________________________________________________________
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

/*______________________________________________________________________
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
