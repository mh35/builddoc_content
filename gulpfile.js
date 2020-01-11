var gulp = require('gulp');
var sass = require('gulp-sass');
var fs = require('fs');
var exec = require('gulp-exec');
var connect = require('gulp-connect');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('./scss/**/*.scss').pipe(
        sass().on('error', sass.logError)).pipe(
        gulp.dest('./dst/css'));
});

gulp.task('sass:watch', function (cb) {
    gulp.watch('./scss/**/*.scss', gulp.series('sass'));
    cb();
});

gulp.task('imgcopy', function () {
    return gulp.src('./articles/img/**').pipe(gulp.dest(
        './dst/img'));
});

gulp.task('imgcopy:watch', function (cb) {
    gulp.watch('./articles/img/**', gulp.series('imgcopy'));
    cb();
});

gulp.task('builddoc', function () {
    let data = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    let files = data.files.map(function (d) {
        return './articles/' + d;
    });
    let taskParams = ['pandoc', '-o', './dst/index.html',
        '--template=./templates/template.html',
        '--metadata', 'pagetitle=本', '--toc'].concat(files.map(
            function (d) {
            return '\'' + d + '\'';
        }));
    return gulp.src(files).pipe(exec(taskParams.join(' '), {
        continueOnError: false,
        pipeStdout: false
    })).pipe(exec.reporter({
        err: false,
        stderr: true,
        stdout: true
    }));
});

gulp.task('builddoc:watch', function (cb) {
    gulp.watch('./articles/*.md', gulp.series('builddoc'));
    cb();
});

gulp.task('preview', function(cb) {
    return gulp.src('./dst').pipe(exec(
        'vivliostyle preview --no-sandbox ./dst/index.html', {
        continueOnError: false,
        pipeStdout: false
    })).pipe(exec.reporter({
        err: false,
        stderr: true,
        stdout: true
    }));
});

gulp.task('buildall', gulp.parallel('sass', 'imgcopy', 'builddoc'));

gulp.task('buildpdf', function(cb) {
    return gulp.src('./dst').pipe(exec(
        'vivliostyle build -o ./dst/output.pdf -s JIS-B5 ' +
        '--no-sandbox ./dst/index.html', {
        continueOnError: false,
        pipeStdout: false
    })).pipe(exec.reporter({
        err: false,
        stderr: true,
        stdout: true
    }));
});

gulp.task('watch', gulp.series(gulp.parallel(
    'sass:watch', 'imgcopy:watch', 'builddoc:watch'), 'preview'));

gulp.task('default', gulp.series('buildall', 'buildpdf'));
