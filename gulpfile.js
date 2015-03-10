var pkg = require('./package');
var config = require('./config');
var gulp = require('gulp');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var templateCache = require('gulp-angular-templatecache');
var eventStream = require('event-stream');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var bowerFiles = require('main-bower-files');


// clean
gulp.task('clean-all', function(){
    return gulp.src([config.paths.dest.base])
        .pipe(clean({force: true}))
});


// uglify
// concat
// copy
var jsFiles = gulp.src(config.paths.source.js)
        .pipe(angularFilesort())
        .pipe(gulp.dest(config.paths.dest.js));

gulp.task('bundlejs', ['jshint'], function () {
    var bundlefile = pkg.name + ".min.js";
    var opt = {newLine: ';'};
    var jsStream = gulp.src(config.paths.source.js);
    var templateStream = templates();
    return eventStream.merge(jsStream, templateStream)
        .pipe(size({showFiles: true}))
        .pipe(uglify())
        .pipe(concat(bundlefile, opt))
        .pipe(gulp.dest(config.paths.dest.js))
        .pipe(size({showFiles: true}));
});

var cssFiles = gulp.src('./css/**/*.css')
    .pipe(gulp.dest('./dev/css'));

gulp.task('bundlecss', function () {
    return gulp.src(config.paths.source.css)
        .pipe(size({showFiles: true}))
        // .pipe(plug.minifyCss({}))
        .pipe(concat(config.name + ".min.css"))
        .pipe(gulp.dest(config.paths.dest.css))
        .pipe(size({showFiles: true}));
});



// jshint
gulp.task('jshint', function () {
    return gulp.src(config.paths.source.js)
        .pipe(jshint('jshintrc.json'))
//        .pipe(jshint.reporter('default'));
        .pipe(jshint.reporter(stylish));
});

// html 2 js
function templates () {
  // create an angular templates.js file from html files in lib
  return gulp.src('src/**/*.html')
    .pipe(templateCache('templates.js', {
      module: 'app'
  }));
}
gulp.task('ng-templates', function () {
  // create an angular templates.js file from html files in lib
  return templates().pipe(gulp.dest('src/templates'));
});


// html inject
gulp.task('scripts', function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:

  var bower = gulp.src(bowerFiles(), {read:false});
  var sources = gulp.src(['./src/**/*.js']).pipe(angularFilesort());
  var css = gulp.src(['./css/**/*.css'], { read: false });

  return target
    .pipe(inject(bower, { name: 'bower' }))

    .pipe(inject(eventStream.merge(
        jsFiles,
        cssFiles
    )))
    .pipe(gulp.dest('./'));

});


// watch with livereload
gulp.task('connect', function() {
  connect.server({
      root: '',
      livereload: true
  });
});

gulp.task('html', function () {
  gulp.src(config.paths.source.html)
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src(config.paths.source.js)
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(config.paths.source.html.concat( config.paths.source.js ), ['jshint', 'html', 'js']);
});

gulp.task('default', ['connect', 'watch']);
