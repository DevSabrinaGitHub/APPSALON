// import path from 'path'
// import fs from 'fs'
// import { glob } from 'glob'
// import { src, dest, watch, series } from 'gulp'
// import * as dartSass from 'sass'
// import gulpSass from 'gulp-sass'
// import terser from 'gulp-terser'
// import sharp from 'sharp'

// const sass = gulpSass(dartSass)

// const paths = {
//     scss: 'src/scss/**/*.scss',
//     js: 'src/js/**/*.js'
// }

// export function css( done ) {
//     src(paths.scss, {sourcemaps: true})
//         .pipe( sass({
//             outputStyle: 'compressed'
//         }).on('error', sass.logError) )
//         .pipe( dest('./public/build/css', {sourcemaps: '.'}) );
//     done()
// }

// export function js( done ) {
//     src(paths.js)
//       .pipe(terser())
//       .pipe(dest('./public/build/js'))
//     done()
// }

// export async function imagenes(done) {
//     const srcDir = './src/img';
//     const buildDir = './public/build/img';
//     const images =  await glob('./src/img/**/*')

//     images.forEach(file => {
//         const relativePath = path.relative(srcDir, path.dirname(file));
//         const outputSubDir = path.join(buildDir, relativePath);
//         procesarImagenes(file, outputSubDir);
//     });
//     done();
// }

// function procesarImagenes(file, outputSubDir) {
//     if (!fs.existsSync(outputSubDir)) {
//         fs.mkdirSync(outputSubDir, { recursive: true })
//     }
//     const baseName = path.basename(file, path.extname(file))
//     const extName = path.extname(file)

//     if (extName.toLowerCase() === '.svg') {
//         const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
//     fs.copyFileSync(file, outputFile);
//     } else {
//         const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
//         const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`);
//         const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`);
//         const options = { quality: 80 };

//         sharp(file).jpeg(options).toFile(outputFile);
//         sharp(file).webp(options).toFile(outputFileWebp);
//         sharp(file).avif().toFile(outputFileAvif);
//     }
// }

// export function dev() {
//     watch( paths.scss, css );
//     watch( paths.js, js );
//     watch('src/img/**/*.{png,jpg}', imagenes)
// }

// export default series( js, css, imagenes, dev )

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const cache = require('gulp-cache');
const clean = require('gulp-clean');
const webp = require('gulp-webp');
const { Version } = require('sass');

const paths = {
    scss:'src/scss/**/*.scss',
    js:'src/js/**/*.js',
    imagenes:'src/img/**/*'
}

function css() {
    return src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/build/css'));
}

function javascript(){
    return src(paths.js)
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/build/js'));
}

function imagenes() {
    return src(paths.imagenes)
    .pipe(cache(imagemin({optimizationLevel:3})))
    .pipe(dest('public/build/img'))
    .pipe(notify({message:'Imagen Completada'}));
}

function versionWebp() {
    return src(paths.imagenes)
    .pipe(webp())
    .pipe(dest('public/build/img'))
    .pipe(notify({message:'Imagen Completada'}));
}

function watchArchivos() {
    watch(paths.scss, css);
    watch(paths.js, javascript);
    watch(paths.imagenes, imagenes);
    watch(paths.imagenes, versionWebp);
}

exports.css = css;
exports.watchArchivos = watchArchivos;
exports.default = parallel(css, javascript, imagenes, versionWebp, watchArchivos);