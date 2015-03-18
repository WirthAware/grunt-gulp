var pkg = require('./package');
var config = require('./config');
var gulp = require('gulp');
var gutil = require('gulp-util');
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
var runSequence = require('run-sequence');
var notify = require("gulp-notify");


/*
 * Auto load all gulp plugins
 */
var gulpLoadPlugins = require("gulp-load-plugins");
var plug = gulpLoadPlugins();


console.log(gutil.env);

/*
clean
*/
gulp.task('clean-index', function () {
        return gulp.src('index.html')
        pipe(clean({force: true}));
});
gulp.task('clean-all', ['clean-index'], function(){
    return gulp.src([config.paths.dest.base])
        .pipe(clean({force: true}))
});
gulp.task('clean', function(){
    return gulp.src([config.paths.dest.base])
        .pipe(clean({force: true}))
});

/*
// copy
*/
var jsFiles = function () {
    return gulp.src(config.paths.source.js)
        .pipe(gulp.dest(config.paths.dest.base));
};

var cssFiles = function () {
    return gulp.src(config.paths.source.css)
     .pipe(gulp.dest(config.paths.dest.css));
};


// uglify
// concat
var bundleJSFiles = function () {
    var bundlefile = pkg.name + ".min.js";
    var opt = {newLine: ';'};
    var jsStream = gulp.src(config.paths.source.js);

    var templateStream = gulp.src('src/**/*.html')
        .pipe(templateCache('templates.js', {
            module: 'templates-app',
            standalone: true
        }));
    var stream = eventStream.merge(jsStream, templateStream).pipe(angularFilesort());

    return stream
        .pipe(size({showFiles: true}))
        .pipe(concat(bundlefile, opt))
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.dest.js))
        .pipe(size({showFiles: true}));
};

gulp.task('bundlejs', ['clean'], function () {
    return bundleJSFiles();
});

var bundleCSSFiles = function () {
    return gulp.src(config.paths.source.css)
        .pipe(size({showFiles: true}))
        .pipe(plug.minifyCss({ keepBreaks:true }))
        .pipe(concat(pkg.name + ".min.css"))
        .pipe(gulp.dest(config.paths.dest.css))
        .pipe(size({showFiles: true}));
};
gulp.task('bundlecss', ['clean'], function () {
    return bundleCSSFiles();
});


// jshint
gulp.task('jshint', function () {
    return gulp.src(config.paths.source.js)
        .pipe(jshint('jshintrc.json'))
//        .pipe(jshint.reporter('default'));
        .pipe(jshint.reporter(stylish));
});


// html 2 js
var viewTemplates = function () {
    return gulp.src('src/**/*.html')
        .pipe(templateCache('templates.js', {
            module: 'templates-app',
            standalone: true
        }))
        .pipe(gulp.dest(config.paths.dest.base + '/app/templates/'));
};
gulp.task('ng-templates', function () {
  // create an angular templates.js file from html files in lib
  return viewTemplates();
});


// html inject
gulp.task('build:dev', ['clean'], function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:

  var bower = gulp.src(bowerFiles(), {read:false});
  var templates = viewTemplates();
  var sources = eventStream.merge(jsFiles(), templates).pipe(angularFilesort());

  return target
    .pipe(inject(bower, { name: 'bower' }))

    .pipe(inject(eventStream.merge(
        sources,
        cssFiles()
    )))
    .pipe(gulp.dest('./'))
    // Notify we are done
    .pipe(notify({
      onLast: true,
      message: "cleaned, html2js, linted, bundled, and css compressed!"
    }));
});
gulp.task('build', ['clean'], function () {
    var target = gulp.src('./src/index.html');
    var bower = gulp.src(bowerFiles(), {read:false});

    return target
      .pipe(inject(bower, { name: 'bower' }))

      .pipe(inject(eventStream.merge(
          bundleJSFiles(),
          bundleCSSFiles()
      )))
      .pipe(gulp.dest('./'))

      // Notify we are done
        .pipe(notify({
            onLast: true,
            message: "cleaned, html2js, linted, bundled, and css compressed!"
        }));
});


// watch with livereload
gulp.task('connect', function() {
  connect.server({
      root: '',
      livereload: true
  });
});
gulp.task('reload', function () {
    gulp.src(config.paths.source.js)
        .pipe(connect.reload());
});
gulp.task('connect:close', function () {
    connect.serverClose();
});

gulp.task('html', ['ng-templates'], function () {
    return gulp.src(config.paths.source.html)
        .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src(config.paths.source.js)
    .pipe(gulp.dest(config.paths.dest.base))
    .pipe(connect.reload());
});
// gulp.task('buildjs:dev', function () {
//     runSequence('js', 'reload');
// });

gulp.task('css', function () {
  gulp.src(config.paths.source.css)
    .pipe(gulp.dest(config.paths.dest.css))
    .pipe(connect.reload());
});
// gulp.task('buildcss:dev', function () {
//     runSequence('css', 'reload');
// });


gulp.task('watch', function () {
    gulp.watch(config.paths.source.js, ['jshint', 'js']);
    gulp.watch(config.paths.source.css, ['css']);
    gulp.watch(config.paths.source.html, ['html']);
});

gulp.task('serve:dev', ['build:dev', 'connect', 'watch']);
gulp.task('serve:prod', ['build', 'connect']);
gulp.task('default', ['serve:dev']);
