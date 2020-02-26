"use strict";

var gulp = require("gulp");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var webp = require("gulp-webp");
var imagemin = require("gulp-imagemin");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var server = require("browser-sync").create();
var del = require("del");
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify-es').default;

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg,jpeg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,jpeg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ], {
      verbose: true
    }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task('htmlminify', () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
});

gulp.task('uglify', function () {
  return gulp.src('source/js/**/*.js', {
    base: 'source'
    })
    .pipe(uglify())
    .pipe(gulp.dest('build/'));
});

gulp.task("css", function () {
  return gulp.src("source/css/style.css")
    .pipe(plumber())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", gulp.series (
  "clean",
  "images",
  "copy",
  "css",
  "uglify",
  "html",
  "htmlminify"
));

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/css/style.css", gulp.series("css"));
  gulp.watch("source/img/icon-*.svg", gulp.series("html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("start", gulp.series("build", "server"));
