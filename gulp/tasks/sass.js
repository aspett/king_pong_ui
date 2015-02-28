var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');

gulp.task('watch', function() {
  gulp.watch(config.src + '/*.scss', ['sass']);
});

var config = {
  src: "./client/src/stylesheets",
  dest:"./client/built/stylesheets",
}

gulp.task('sass', function() {
    return sass(config.src) 
    .on('error', function (err) {
      console.error('[gulp] [sass]', err.message);
     })
    .pipe(concat('client.css'))
    .pipe(gulp.dest(config.dest));
});
