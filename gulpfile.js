var gulp = require('gulp');
var sass = require('gulp-sass');
var shell = require('gulp-shell');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('./scss/**/*.scss').pipe(
        sass().on('error', sass.logError)).pipe(
        gulp.dest('./dst/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./scss/**/*.scss', gulp.series('sass'));
});

gulp.task('imgcopy', function () {
    return gulp.src('./articles/img/**').pipe(gulp.dest(
        './dst/img'));
});

gulp.task('imgcopy:watch', function () {
    gulp.watch('./articles/img/**', gulp.series('imgcopy'));
});
