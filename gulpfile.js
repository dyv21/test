const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sync = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');

const del = require('del');

// Styles

const styles = () => {
  return gulp
    .src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename('style.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('docs/css/'))
    .pipe(sync.stream());
};

exports.styles = styles;

// Images

const images = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}').pipe(
    imagemin([
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
      }),
    ])
  );
};
exports.images = images;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'docs/',
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};
exports.server = server;

// Copy

const copy = () => {
  return gulp
    .src(['source/*.html', 'source/js/*.js', 'source/img/**'], {
      base: 'source/',
    })
    .pipe(gulp.dest('docs'));
};

exports.copy = copy;

// Clean

const clean = () => {
  return del('docs');
};

exports.clean = clean;

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(copy));
  gulp.watch('source/js/*.js', gulp.series(copy));
  gulp.watch('source/*.html').on('change', sync.reload);
};

exports.docs = gulp.series(clean, copy, styles, images);

exports.start = gulp.series(exports.docs, server, watcher);
