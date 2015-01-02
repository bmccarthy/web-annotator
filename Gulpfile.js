'use strict';

var gulp = require('gulp'),
  cleanhtml = require('gulp-cleanhtml'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  zip = require('gulp-zip'),
  bump = require('gulp-bump'),
  del = require('del'),
  usemin = require('gulp-usemin');

var appFolder = './app/';

gulp.task('usemin', function () {
  return gulp.src(appFolder + '*.html')
    .pipe(usemin({
      css: [minifycss({root: appFolder + 'styles', keepSpecialComments: 0}), 'concat'],
      js: [stripdebug(), uglify({outSourceMap: true}), 'concat'],
      html: [cleanhtml()]
    }))
    .pipe(gulp.dest('build'));
});

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

  return gulp.src(appFolder + 'manifest.json')
    .pipe(bump())
    .pipe(gulp.dest('app'));
});

//copy static folders to build directory
gulp.task('copy', ['bump'], function () {
  gulp.src(appFolder + 'icons/**')
    .pipe(gulp.dest('build/icons'));
  gulp.src(appFolder + '_locales/**')
    .pipe(gulp.dest('build/_locales'));
  return gulp.src(appFolder + 'manifest.json')
    .pipe(gulp.dest('build'));
});

//run scripts through JSHint
gulp.task('jshint', function () {
  return gulp.src([appFolder + 'scripts/**/*.js', 'Gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('chromeManifest', function () {
  var manifest = require(appFolder + 'manifest');

  gulp.src(manifest.background.scripts.concat(['!bower_components/**']), {cwd: appFolder})
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(gulp.dest('build/scripts'));

  for (var i = 0; i < manifest.content_scripts.length; i++) { // jshint ignore:line
    gulp.src(manifest.content_scripts[i].js.concat(['!bower_components/**']), {cwd: appFolder}) // jshint ignore:line
      .pipe(stripdebug())
      .pipe(uglify())
      .pipe(gulp.dest('build/scripts'));
  }
});

//copy vendor scripts
gulp.task('scripts', ['jshint'], function () {
  gulp.src(appFolder + 'bower_components/angular/*.min.js')
    .pipe(gulp.dest('build/bower_components/angular'));
  gulp.src(appFolder + 'bower_components/angular-bootstrap-colorpicker/**/{*.min.css,*.png,*.min.js}')
    .pipe(gulp.dest('build/bower_components/angular-bootstrap-colorpicker'));

  gulp.src(appFolder + 'bower_components/bootstrap/dist/fonts/**')
    .pipe(gulp.dest('build/bower_components/bootstrap/dist/fonts'));
  gulp.src(appFolder + 'bower_components/bootstrap/dist/**/{*.min.css,*.min.js}')
    .pipe(gulp.dest('build/bower_components/bootstrap/dist'));

  gulp.src(appFolder + 'bower_components/jquery/dist/*.min.js')
    .pipe(gulp.dest('build/bower_components/jquery/dist'));

  return gulp.src(appFolder + 'bower_components/rangy-official/*.min.js')
    .pipe(gulp.dest('build/bower_components/rangy-official'));
});

//build ditributable and sourcemaps after other tasks completed
gulp.task('zip', ['scripts', 'usemin', 'copy', 'chromeManifest'], function () {
  var pkg = require('./package.json'),
    manifest = require('./build/manifest.json'),
    distFileName = pkg.name + '-v' + manifest.version + '.zip';

  return gulp.src(['build/**'])
    .pipe(zip(distFileName))
    .pipe(gulp.dest('dist'));
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['clean'], function () {
  gulp.start('zip');
});
