
// // import gulp from 'gulp';
// // import sass from 'gulp-sass';
// // import sassCompiler from 'sass';
// // import autoprefixer from 'autoprefixer';
// // import postcss from 'gulp-postcss';
// // import sourcemaps from 'gulp-sourcemaps';
// // import cssnano from 'cssnano';
// // import concat from 'gulp-concat';
// // import terser from 'gulp-terser-js';
// // import rename from 'gulp-rename';
// // import imagemin from 'gulp-imagemin';
// // import notify from 'gulp-notify';
// // import cache from 'gulp-cache';
// // import clean from 'gulp-clean';
// // import webp from 'gulp-webp';

// // // Configuración de rutas
// // const paths = {
// //     scss: 'src/scss/*/.scss',  // Cambia aquí
// //     js: 'src/js/*/.js',        // Cambia aquí
// //     imagenes: 'src/img/*/'     // Cambia aquí
// // };

// // // Compilación de CSS
// // const sassCompiler = sass; // Usa directamente sass

// // function css() {
// //     return gulp.src(paths.scss)
// //         .pipe(sourcemaps.init())
// //         .pipe(sassCompiler()) // Usa directamente la función
// //         .pipe(postcss([autoprefixer(), cssnano()]))
// //         .pipe(sourcemaps.write('.'))
// //         .pipe(gulp.dest('public/build/css'));
// // }

// // // Minificación de JavaScript
// // function javascript() {
// //     return gulp.src(paths.js)
// //         .pipe(terser())
// //         .pipe(sourcemaps.write('.'))
// //         .pipe(gulp.dest('public/build/js'));
// // }

// // // Optimización de imágenes
// // function imagenes() {
// //     return gulp.src(paths.imagenes)
// //         .pipe(cache(imagemin({ optimizationLevel: 3 })))
// //         .pipe(gulp.dest('public/build/img'))
// //         .pipe(notify({ message: 'Imagen Completada' }));
// // }

// // // Conversión a WebP
// // function versionWebp() {
// //     return gulp.src(paths.imagenes)
// //         .pipe(webp())
// //         .pipe(gulp.dest('public/build/img'))
// //         .pipe(notify({ message: 'Imagen Completada' }));
// // }

// // // Observador de archivos
// // function watchArchivos() {
// //     gulp.watch(paths.scss, css);
// //     gulp.watch(paths.js, javascript);
// //     gulp.watch(paths.imagenes, imagenes);
// //     gulp.watch(paths.imagenes, versionWebp);
// // }

// // // Exportar tareas
// // export { css, watchArchivos };
// // export default gulp.parallel(css, javascript, imagenes, versionWebp, watchArchivos);

// import gulp from 'gulp';
// import sass from 'gulp-sass';
// import * as sassCompiler from 'sass';  
// import autoprefixer from 'autoprefixer';
// import postcss from 'gulp-postcss';
// import sourcemaps from 'gulp-sourcemaps';
// import cssnano from 'cssnano';
// import concat from 'gulp-concat';
// import terser from 'gulp-terser-js';
// import rename from 'gulp-rename';
// import imagemin from 'gulp-imagemin';
// import notify from 'gulp-notify';
// import cache from 'gulp-cache';
// import clean from 'gulp-clean';
// import webp from 'gulp-webp';

// // Configuración de rutas
// const paths = {
//     scss: 'src/scss/*/.scss',
//     js: 'src/js/*/.js',
//     imagenes: 'src/img/*/'
// };

// // Configurar gulp-sass con el compilador de Sass
// const sassCompile = sass(sassCompiler);

// function css() {
//     return gulp.src(paths.scss)
//         .pipe(sourcemaps.init())
//         .pipe(sassCompile())  // Usar el compilador 
//         .pipe(postcss([autoprefixer(), cssnano()]))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('public/build/css'));
// }

// // Minificación de JavaScript
// function javascript() {
//     return gulp.src(paths.js)
//         .pipe(terser())
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('public/build/js'));
// }

// // Optimización de imágenes
// function imagenes() {
//     return gulp.src(paths.imagenes)
//         .pipe(cache(imagemin({ optimizationLevel: 3 })))
//         .pipe(gulp.dest('public/build/img'))
//         .pipe(notify({ message: 'Imagen Completada' }));
// }

// // Conversión a WebP
// function versionWebp() {
//     return gulp.src(paths.imagenes)
//         .pipe(webp())
//         .pipe(gulp.dest('public/build/img'))
//         .pipe(notify({ message: 'Imagen Completada' }));
// }

// // Observador de archivos
// function watchArchivos() {
//     gulp.watch(paths.scss, css);
//     gulp.watch(paths.js, javascript);
//     gulp.watch(paths.imagenes, imagenes);
//     gulp.watch(paths.imagenes, versionWebp);
// }

// // Exportar tareas
// export { css, watchArchivos };
// export default gulp.parallel(css, javascript, imagenes, versionWebp, watchArchivos);

import path from 'path'
import fs from 'fs'
import { glob } from 'glob'
import { src, dest, watch, series } from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import terser from 'gulp-terser'
import sharp from 'sharp'

const sass = gulpSass(dartSass)

const paths = {
    scss: 'src/scss/*/.scss',
    js: 'src/js/*/.js'
}

export function css( done ) {
    src(paths.scss, {sourcemaps: true})
        .pipe( sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError) )
        .pipe( dest('./public/build/css', {sourcemaps: '.'}) );
    done()
}

export function js( done ) {
    src(paths.js)
      .pipe(terser())
      .pipe(dest('./public/build/js'))
    done()
}

export async function imagenes(done) {
    const srcDir = './src/img';
    const buildDir = './public/build/img';
    const images =  await glob('./src/img/*/')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)

    if (extName.toLowerCase() === '.svg') {
        // If it's an SVG file, move it to the output directory
        const outputFile = path.join(outputSubDir, ${baseName}${extName});
    fs.copyFileSync(file, outputFile);
    } else {
        // For other image formats, process them with sharp
        const outputFile = path.join(outputSubDir, ${baseName}${extName});
        const outputFileWebp = path.join(outputSubDir, ${baseName}.webp);
        const outputFileAvif = path.join(outputSubDir, ${baseName}.avif);
        const options = { quality: 80 };

        sharp(file).jpeg(options).toFile(outputFile);
        sharp(file).webp(options).toFile(outputFileWebp);
        sharp(file).avif().toFile(outputFileAvif);
    }
}

export function dev() {
    watch( paths.scss, css );
    watch( paths.js, js );
    watch('src/img/*/.{png,jpg}', imagenes)
}

export default series( js, css, imagenes, dev )