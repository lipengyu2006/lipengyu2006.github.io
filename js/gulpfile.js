'use strict';

const del = require('del');
const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const babelify = require('babelify');
const browserify = require('browserify');
const watchify = require('watchify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

const jsname = 'app.js';
const jsentry = 'src/' + jsname;

function doWatchify() {
  let customOpts = {
    entries: jsentry,
    debug: true,
    transform: ['babelify'],
    plugin: ['browserify-derequire']
  };

  let opts = Object.assign({}, watchify.args, customOpts);
  let b = watchify(browserify(opts));

  b.on('update', doBundle.bind(global, b));
  b.on('log', console.log.bind(console));

  return b;
}

function doBundle(b) {
  return b.bundle()
    .on('error', console.error.bind(console))
    .pipe(source(jsname))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.mapSources(doMap))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dest/'));
}

function doMap(sourcePath, file) {
  return '../' + sourcePath;
}

gulp.task('default', ['clean', 'build']);
gulp.task('release', ['clean', 'build', 'minimize']);

gulp.task('watch', ['clean'], function () {
  return doBundle(doWatchify());
});

gulp.task('clean', function () {
  return del([
    'dest/*'
  ]);
});

gulp.task('build', ['clean'], function () {
  let b = browserify({
    entries: jsentry,
    debug: true,
    transform: ['babelify'],
    plugin: ['browserify-derequire']
  });

  return doBundle(b);
});

gulp.task('minimize', ['build'], function () {
  let options = {
    mangle: true,
    compress: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true
    }
  };

  return gulp.src('dest/' + jsname)
    .pipe(rename({extname: '.min.js'}))
      .pipe(uglify(options))
      .on('error', console.error.bind(console))
    .pipe(gulp.dest('./dest/'));
});