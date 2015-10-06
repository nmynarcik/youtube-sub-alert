var gulp = require('gulp'),
     livereload = require('gulp-livereload'),
     jshint = require('gulp-jshint'),
     react = require('gulp-react'),
    sass = require('gulp-sass');

var jsFiles = [
  'src/**/*.js',
  'test/**/*.js',
  '*.jsx'
];


gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  console.log('Watching files for changes...');
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch(jsFiles, ['jshint']);
  livereload();
});

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(express.static(__dirname));
  app.listen(1337, '0.0.0.0');
});

gulp.task('jshint', function() {
  var stream = gulp.src(jsFiles)
    .pipe(react())
    .on('error', function(err) {
      console.error('JSX ERROR in ' + err.fileName);
      console.error(err.message);
      this.end();
    })
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(livereload());

  if (process.env.CI) {
    stream = stream.pipe(jshint.reporter('fail'));
  }

  return stream;
});

gulp.task('default', ['express','jshint','watch'], function() {

});
