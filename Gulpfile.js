'use strict';

var gulp = require('gulp'),
  cleanhtml = require('gulp-cleanhtml'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  zip = require('gulp-zip'),
  bump = require('gulp-bump'),
  del = require('del');

//clean build directory
gulp.task('clean', function (cb) {
  del([
    'build/**'
  ], cb);
});

// bump versions on package/bower/manifest
gulp.task('bump', function () {
  gulp.src(['./bower.json', './package.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));

  return gulp.src('app/manifest.json')
    .pipe(bump())
    .pipe(gulp.dest('app'));
});

//copy static folders to build directory
gulp.task('copy', function () {
  gulp.src('app/icons/**')
    .pipe(gulp.dest('build/icons'));
  gulp.src('app/_locales/**')
    .pipe(gulp.dest('build/_locales'));
  return gulp.src('app/manifest.json')
    .pipe(gulp.dest('build'));
});

//copy and compress HTML files
gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe(cleanhtml())
    .pipe(gulp.dest('build'));
});

//run scripts through JSHint
gulp.task('jshint', function () {
  return gulp.src(['app/scripts/**/*.js', 'Gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//copy vendor scripts and uglify all other scripts, creating source maps
gulp.task('scripts', ['jshint'], function () {
  gulp.src('app/bower_components/angular/angular.*js')
    .pipe(gulp.dest('build/bower_components/angular'));
  gulp.src('app/bower_components/angular-bootstrap-colorpicker/{css,img,js}/**')
    .pipe(gulp.dest('build/bower_components/angular-bootstrap-colorpicker'));
  gulp.src('app/bower_components/bootstrap/dist/**')
    .pipe(gulp.dest('build/bower_components/bootstrap/dist'));
  gulp.src('app/bower_components/jquery/dist/**')
    .pipe(gulp.dest('build/bower_components/jquery/dist'));
  gulp.src('app/bower_components/rangy-official/*.js')
    .pipe(gulp.dest('build/bower_components/rangy-official'));

  return gulp.src('app/scripts/**/*.js')
    .pipe(stripdebug())
    .pipe(uglify({outSourceMap: true}))
    .pipe(gulp.dest('build/scripts'));
});

//minify styles
gulp.task('styles', function () {
  return gulp.src('app/styles/**/*.css')
    .pipe(minifycss({root: 'app/styles', keepSpecialComments: 0}))
    .pipe(gulp.dest('build/styles'));
});

//build ditributable and sourcemaps after other tasks completed
gulp.task('zip', ['bump', 'html', 'scripts', 'styles', 'copy'], function () {
  var manifest = require('./app/manifest'),
    pkg = require('./package.json'),
    distFileName = pkg.name + '-v' + manifest.version + '.zip',
    mapFileName = pkg.name + '-v' + manifest.version + '-maps.zip';
  //collect all source maps
  gulp.src('build/scripts/**/*.map')
    .pipe(zip(mapFileName))
    .pipe(gulp.dest('dist'));
  //build distributable extension
  return gulp.src(['build/**', '!build/scripts/**/*.map'])
    .pipe(zip(distFileName))
    .pipe(gulp.dest('dist'));
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['clean'], function () {
  gulp.start('zip');
});