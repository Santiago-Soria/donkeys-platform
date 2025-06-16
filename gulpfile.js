const gulp = require('gulp');
const del = require('del'); // Versión 5 compatible CommonJS

// Limpiar carpeta build
gulp.task('limpiar-build', function () {
  return del(['build/**', '!build']);
});

// Copiar CSS
gulp.task('copiar-css', function () {
  return gulp.src('CSS/**/*.css')
    .pipe(gulp.dest('build/CSS'));
});

// Copiar JS
gulp.task('copiar-js', function () {
  return gulp.src('JS/**/*.js')
    .pipe(gulp.dest('build/JS'));
});

// Copiar HTML directamente a build/
gulp.task('copiar-html', function () {
  return gulp.src('HTML/**/*.html')
    .pipe(gulp.dest('build/'));
});

// Copiar imágenes
gulp.task('copiar-imagenes', function () {
  return gulp.src('Imagenes/**/*')
    .pipe(gulp.dest('build/Imagenes'));
});

// Copiar íconos (archivos .ico)
gulp.task('copiar-iconos', function () {
  return gulp.src('*.ico')
    .pipe(gulp.dest('build/'));
});

// Tarea para copiar todo (sin limpiar)
gulp.task('copiar-todo', gulp.parallel(
  'copiar-css',
  'copiar-js',
  'copiar-html',
  'copiar-imagenes',
  'copiar-iconos'
));

// Tarea por defecto: limpiar y luego copiar todo
gulp.task('default', gulp.series(
  'limpiar-build',
  'copiar-todo'
));
