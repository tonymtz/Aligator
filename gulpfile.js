/**
 * Aligator
 */

var gulp = require('gulp'),
  mocha = require('gulp-mocha-co'),
  exit = require('gulp-exit');

gulp.task('test-all', function (){
  gulp.src(['server/test/*.js'])
    .pipe(mocha({
      reporter: 'spec'
    }))
    .pipe(exit());
});
