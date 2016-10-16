var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var runSequence = require('run-sequence');
var fs = require('fs');
var del = require('del');
var Q = require('q');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var dist = 'dist';
var src = 'src';

var globCore = [src+'/core/motorhaus.js', src+'/**/*.js', '!'+src+'/extras/**/*.js'];
var globExtras = {
	'common': [src+'/extras/components/input/*.js', src+'/extras/components/Health.js', src+'/extras/components/graphics/Timer.js', src+'/extras/components/ai/StackFSM.js'],
	'three': [src+'/extras/Scene.js', src+'/extras/components/graphics/THREECube.js'],
	'pixi': [src+'/extras/Camera2.js', src+'/extras/TileMap2.js', src+'/extras/Vec2.js', src+'/extras/FlowGrid.js', src+'/extras/Emitter.js', src+'/extras/steering.js', src+'/extras/VectorFieldState.js', src+'/extras/entities/BoidGroup.js', src+'/extras/components/ai/Boid.js', src+'/extras/components/graphics/PIXISprite.js']
};

/*______________________________________________________________________
	MACRO
*/

gulp.task('default', function(callback) {
	runSequence('clean',
	            ['core', 'extras'],
	            callback);
});

gulp.task('dev', function(callback) {
	runSequence('clean',
	            ['core', 'extras'],
	            'examples',
	            callback);
});

gulp.task('clean', del.bind(null, [dist]));

/*______________________________________________________________________
	SCRIPTS
*/

gulp.task('core', function() {
	return gulp.src(globCore)
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
	var promises = Object.keys(globExtras).map(function (key) {
		var deferred = Q.defer();
		var val = globExtras[key];

		gulp.src(val)
			.pipe(plumber({errorHandler: handleErrors}))
			.pipe(eslint({ fix: true }))
			.pipe(eslint.formatEach())
			.pipe(eslint.failOnError())
			.pipe(sourcemaps.init())
			.pipe(concat('motorhaus-extras-'+key+'.min.js'))
			.pipe(uglify())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(dist))
			.on('end', function () {
				deferred.resolve();
			});

		return deferred.promise;
	});
	return Q.all(promises);
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
	gulp.watch(globCore, ['core']);
	gulp.watch(globExtras.common, ['extras']);
	gulp.watch(globExtras.three, ['extras']);
	gulp.watch(globExtras.pixi, ['extras']);
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
