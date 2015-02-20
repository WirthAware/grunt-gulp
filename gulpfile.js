var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
      root: '',
      livereload: true
  });
});

gulp.task('html', function () {
  gulp.src(['./src/*.html'])
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src(['./src/app/*.js'])
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./src/*.html', './src/app/*.js'], ['html', 'js']);
});

gulp.task('default', ['connect', 'watch']);
