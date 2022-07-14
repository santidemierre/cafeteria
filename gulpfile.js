const { src, dest, watch, series } = require('gulp'); // {} Importa MAS de una funcion

// CSS y SASS
const sass = require('gulp-sass')(require('sass')); // Importa solo una funcion
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer'); 
const sourcemaps = require('gulp-sourcemaps'); 
const cssnano = require('cssnano');


// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done) {
    // Compilar saas
    // Pasos 1 - Identificar archivo, 2 - Compilarla, 3 - Guardar el .css

    src('src/scss/app.scss')
        .pipe( sourcemaps.init() )
        .pipe( sass({outputStyle: 'expanded'}) ) // Para comprimir la hoja de estlos
        .pipe( postcss( [autoprefixer(), cssnano()] ) )
        .pipe( sourcemaps.write( '.' ) )
        .pipe( dest('build/css') )

    done();
}

function imagenes() {
    return src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest('build/img') )
}

function versionWebp() {
    const opciones = {
        quality: 50
    }

    return src('src/img/**/*.{png, jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img') ) // Para almacenar en el disco duro
}

function versionAvif() {
    const opciones = {
        quality: 50
    }

    return src('src/img/**/*.{png, jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('build/img') ) // Para almacenar en el disco duro
}

function dev() {
    // Toma 2 valores.. a que le tengo que prestar atención? 'src/scss/app.scss' yyy, cuando haya cambios vuelve a llamar a la funcion css
    watch( 'src/scss/**/*.scss', css );
    watch( 'src/img/**/*', imagenes );
}


exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionWebp, versionAvif, css, dev );

// series() - Se inicia una tarea, y hasta que finaliza, inicia la siguiente. Luego se queda en el watch
// parallel() - Todas inician al mismo tiempo