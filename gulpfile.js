var gulp = require('gulp');
var sass = require('gulp-sass');
var fs = require('fs');
var exec = require('gulp-exec');

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

gulp.task('builddoc', function () {
    let data = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    let files = data.files.map(function (d) {
        return './articles/' + d;
    });
    let taskParams = ['pandoc', '-o', './dst/index.html',
        '--template=./templates/template.html',
        '--metadata', 'pagetitle=本'].concat(files);
    return gulp.src(files).pipe(exec(taskParams.join(' '), {
        continueOnError: false,
        pipeStdout: false
    })).pipe(exec.reporter({
        err: false,
        stderr: true,
        stdout: true
    }));
});

gulp.task('builddoc:watch', function () {
    gulp.watch('./articles/*.md', gulp.series('builddoc'));
});
