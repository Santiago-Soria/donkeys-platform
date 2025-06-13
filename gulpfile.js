const { src, dest, series, parallel, watch } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

// JS
const terser = require('gulp-terser-js');

// Utilidades
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const clean = require('gulp-clean');

// Imágenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Rutas
const paths = {
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  img: 'Imagenes/**/*'
};

// Tarea: Compilar SASS
function css() {
  return src(paths.scss)
    .pipe(plumber({ errorHandler: notify.onError("Error en SASS: <%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css'));
}

function html() {
  return src('HTML/**/*.html')
    .pipe(dest('build'));
}


// Tarea: Minificar JS
function js() {
  return src(paths.js)
    .pipe(plumber({ errorHandler: notify.onError("Error en JS: <%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));  // Cambiado de dist/js a build/js
}

// Tarea: Optimizar imágenes
function imagenes() {
  return src(paths.img)
    .pipe(imagemin())
    .pipe(dest('build/img'));
}

// Tarea: Convertir a WebP
function versionWebp() {
  return src(paths.img)
    .pipe(webp())
    .pipe(dest('build/img'));
}

// Tarea: Convertir a AVIF
function versionAvif() {
  return src(paths.img)
    .pipe(avif())
    .pipe(dest('build/img'));
}

// Tarea: Limpiar dist
function limpiar() {
  return src('build', { read: false, allowEmpty: true })
    .pipe(clean());
}

// Tarea: Watch
function dev() {
  watch(paths.scss, css);
  watch(paths.js, js);
  watch(paths.img, series(imagenes, versionWebp, versionAvif));
}

// Tarea por defecto
exports.default = series(
  limpiar,
  parallel(css, js, imagenes, versionWebp,/* versionAvif,*/ html),
  dev
);
