const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const imageMin = require('gulp-imagemin');

gulp.task('styles', () => {
  return gulp.src('./src/sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
      overrideBrowserslist : ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css/'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  return gulp.src('./src/js/**/*.js')
    .pipe(concat('script.js'))
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(gulp.dest('./build/js/'))
    .pipe(browserSync.stream());
});

gulp.task('image', () => {
  return gulp.src('./src/img/**')
    .pipe(imageMin({
      progressive: true
    }))
    .pipe(gulp.dest('./build/img/'));
});

gulp.task('clean', () => {
  return del(['build/css', 'build/js', 'build/img']);
});

gulp.task('watch', () => {
  browserSync.init({
    server: {
        baseDir: "./"
    }
  });
  gulp.watch('./src/img/**', gulp.series('image'));
  gulp.watch('./src/sass/**/*.sass', gulp.series('styles'));
  gulp.watch('./src/js/**/*.js', gulp.series('scripts'));
  gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('default', gulp.series('clean', gulp.parallel('image', 'styles', 'scripts'), 'watch'));