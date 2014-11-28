var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    path = require('path');

env = 'development';

if (env==='development') {
  outputDir = 'builds/development/';
} else {
  outputDir = 'builds/production/';
}

gulp.task('watch', function() {
  gulp.watch('builds/development/js/*.js', ['js']);
  gulp.watch(['builds/development/css/*.css'], ['css']);
  gulp.watch('builds/development/*.html', ['html']);
});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

gulp.task('css', function() {
  gulp.src('builds/development/css/*.css')
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'css')))
    .pipe(connect.reload())
});

gulp.task('js', function() {
  gulp.src('builds/development/js/*.js')
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'js')))
    .pipe(connect.reload())
});

// Copy images to production
gulp.task('move', function() {
  gulp.src('builds/development/images/**/*.*')
  .pipe(gulpif(env === 'production', gulp.dest(outputDir+'images')))
});

gulp.task('default', ['watch', 'html', 'js', 'css', 'move', 'connect']);
