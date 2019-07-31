import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import browsersync from 'browser-sync';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import config from '../config';

/*
 * Сжатие картинок
 */

function images(done) {
    browsersync.notify('Compiling images');
    // отключаю оптимизацию картинок для дева
    if (gutil.env.env !== 'prod') {
        return gulp.src(config.images.src)
            .pipe(plumber({
                errorHandler: notify.onError(err => ({
                    title: 'Image dev copy',
                    message: err.toString()
                }))
            }))
            .pipe(newer(config.images.dest))
            .pipe(gulp.dest(config.images.dest));
    } else {
        return gulp.src(config.images.srcProduction)
            .pipe(plumber({
                errorHandler: notify.onError(err => ({
                    title: 'Image optimizer',
                    message: err.toString()
                }))
            }))
            .pipe(newer(config.images.dest))
            .pipe(imagemin([
                imagemin.gifsicle({
                    optimizationLevel: 3
                }),
                imagemin.jpegtran({
                    quality: 65,
                    progressive: true
                }),
                imagemin.optipng({
                    optimizationLevel: 5
                }),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: false},
                        {convertStyleToAttrs: true}
                    ]
                })
            ]))
            .pipe(gulp.dest(config.images.dest));
    }
}
images.description = 'Оптимизация картинок';

export default images;
