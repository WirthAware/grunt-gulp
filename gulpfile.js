var gulp = require('gulp');
var connect = require('gulp-connect');
var pkg = require('./package');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

// clean
gulp.task('clean-all', function(){
    return gulp.src([pkg.paths.dest.base])
        .pipe(clean({force: true}))
});


// uglify
// concat
// copy
gulp.task('bundlejs', ['jshint'], function () {
    var bundlefile = pkg.name + ".min.js";
    var opt = {newLine: ';'};

    return gulp.src(pkg.paths.source.js)
        .pipe(size({showFiles: true}))
        .pipe(uglify())
        .pipe(concat(bundlefile, opt))
        .pipe(gulp.dest(pkg.paths.dest.js))
        .pipe(size({showFiles: true}));
});

gulp.task('bundlecss', function () {
    return gulp.src(pkg.paths.source.css)
        .pipe(size({showFiles: true}))
        // .pipe(plug.minifyCss({}))
        .pipe(concat(pkg.name + ".min.css"))
        .pipe(gulp.dest(pkg.paths.dest.css))
        .pipe(size({showFiles: true}));
});


// jshint
gulp.task('jshint', function () {
    return gulp.src(pkg.paths.source.js)
        .pipe(jshint('jshintrc.json'))
//        .pipe(jshint.reporter('default'));
        .pipe(jshint.reporter(stylish));
});


// watch with livereload
gulp.task('connect', function() {
  connect.server({
      root: '',
      livereload: true
  });
});

gulp.task('html', function () {
  gulp.src(pkg.paths.source.html)
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src(pkg.paths.source.js)
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(pkg.paths.source.html.concat( pkg.paths.source.js ), ['jshint', 'html', 'js']);
});

gulp.task('default', ['connect', 'watch']);
