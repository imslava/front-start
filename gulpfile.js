const {src, dest, parallel, series, watch} = require('gulp');

const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const nunjucksRender = require('gulp-nunjucks-render');
const ngModuleSort = require('gulp-ng-module-sort');
const replace = require('gulp-replace');
const listing = require('is-pagelist');
const cryptoRandomString = require('crypto-random-string');
const randomVersion = cryptoRandomString({length: 8});

const clean = () => {
  return del(['app/*'])
}

const styles = () => {
  src('./src/sass/**/*.sass')
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream());
  return src('./src/sass/**/*.sass')
    .pipe(sass())
    .pipe(concat('main.min.css'))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream());
};

const libs = () => {
  return src([
    './src/js/vendor/jquery.fancybox.min.js',
    './src/js/vendor/swiper-bundle.min.js',
    './src/js/vendor/jquery.inputmask.min.js',
  ])
    .pipe(ngModuleSort())
    .pipe(concat('libs.min.js'))
    // .pipe(uglify())
    .pipe(dest('./app/js/'))
    .pipe(browserSync.stream());
}

const scriptsMin = () => {
  return src([
    './src/js/main.js',
    './src/js/swiper.js',
  ])
    .pipe(ngModuleSort())
    .pipe(concat('common.min.js'))
    // .pipe(uglify())
    .pipe(dest('./app/js/'))
    .pipe(browserSync.stream());
}

const htmlInclude = () => {
  return src(['./src/pages/*.html'])
    .pipe(nunjucksRender({
      path: ['./src/pages/']
    }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream());
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./app'))
}

const images = () => {
  return src('./src/img/**/*')
    .pipe(dest('./app/img'))
};

const pageList = () => {
  return src('./app/*.html')
    .pipe(listing('page-list.html'))
    .pipe(dest('./app/'));
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "./app"
    },
  });

  watch('./src/sass/**/*.sass', styles);
  watch('./src/js/**/*.js', scriptsMin);
  watch('./src/pages/**/*.html', htmlInclude);
  watch('./src/*.html', htmlInclude);
  watch('./src/resources/**', resources);
  watch('./src/img/**/*', images);
}

function versionFile(){
	return src('app/*.html')
		.pipe(replace('?v=hash', '?v=' + randomVersion + ''))
	.pipe(dest('app'))
}

exports.default = series(htmlInclude, libs, scriptsMin, styles, resources, images, watchFiles);

exports.build = series(clean, htmlInclude, libs, scriptsMin, styles, resources, images, versionFile, pageList);