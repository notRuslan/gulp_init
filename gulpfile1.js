const gulp = require('gulp');
const pug = require('gulp-pug');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync').create();

const paths = {
    root: './build',
    templates: {
        pages: 'src/templates/pages/*.pug',
        src: 'src/templates/**/.pug',
        dest: 'build/assets/'
    },
    styles: {
        src: "src/styles/**/*.scss",
        dest: "build/assets/styles"
    }
}

//pug
function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({pretty:true}))
        .pipe(gulp.dest(paths.root));
}

function styles() {
    return gulp.src('./src/styles/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest))
}

function clean() {
    return del(paths.root);
}

function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    // gulp.watch(paths.root, templates);

}
// локальный сервер + livereload (встроенный)
function server() {
    browserSync.init({
        server: paths.root,
        browser: "chrome"
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}
// function server() {
//     browserSync.init({
//         server: paths.root,
//         // browser: "chrome"
//     });
//     browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
// }

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, templates),
    gulp.parallel(watch, server)
));