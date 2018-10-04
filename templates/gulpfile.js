"use strict";

var gulp = require('gulp'),
	  concat = require('gulp-concat'),
	  uglify = require('gulp-uglify'),
	  rename = require('gulp-rename'),
	  sass = require('gulp-sass'),
	  maps = require('gulp-sourcemaps'),
	  del = require('del'),
	  autoprefixer = require('gulp-autoprefixer'),
	  browserSync = require('browser-sync').create(),
	  htmlreplace = require('gulp-html-replace'),
	  cssmin = require('gulp-cssmin');

gulp.task("concatScripts", function() {
	return gulp.src([
		'js/jquery.min.js',
		'js/popper.min.js',
		'js/bootstrap.min.js',
		'js/chart.min.js',
		'js/jquery-modal-video.min.js',
		'js/owl.carousel.min.js',
		'js/custom.js'
	])
		.pipe(maps.init())
		.pipe(concat('main.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('js'))
		.pipe(browserSync.stream());
});

gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("js/main.js")
      .pipe(gulp.dest('dist/js'));
});

gulp.task('compileSass', function() {
  return gulp.src("css/main.scss")
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
});

gulp.task("minifyCss", ["compileSass"], function() {
  return gulp.src("css/main.css")
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watchFiles', function() {
  gulp.watch('css/**/*.scss', ['compileSass']);
  gulp.watch('js/*.js', ['concatScripts']);
})

gulp.task("build", ['minifyScripts', 'minifyCss'], function() {
  return gulp.src([
		'*.html',
		'*.php',
		'favicon.ico',
		"fonts/**",
		'css/**',
		"images/**"
	], { base: './'})
		.pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles'], function(){
  browserSync.init({
  	server: "./"
  });

  gulp.watch("css/**/*.scss", ['watchFiles']);
  gulp.watch(['*.html', '*.php']).on('change', browserSync.reload);
});

gulp.task("default", ['build'], function() {
  
});
