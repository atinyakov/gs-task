import gulp from 'gulp';
import babel from 'gulp-babel';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import browsersync from 'browser-sync';
import fileinclude from 'gulp-file-include';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import config from '../config'

/*
 * Сборка js
 * Минификация
 */

export function jsInternal() {
    browsersync.notify('Compiling js internal');

    return gulp.src(config.js.srcInternal)
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: 'JS internal',
                message: err.toString()
            }))
        }))
        .pipe(gutil.env.env === 'prod' ? gutil.noop() : sourcemaps.init())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(babel())
        .pipe(gutil.env.env === 'prod' ? uglify(config.uglify) : gutil.noop())
        .pipe(gutil.env.env === 'prod' ? gutil.noop() : sourcemaps.write())
        .pipe(gulp.dest(config.js.dest));
}
jsInternal.description = 'Сборка internal js';



export function jsExternal() {
    browsersync.notify('Compiling js external');

    return gulp.src(config.js.srcExternal)
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: 'JS external',
                message: err.toString()
            }))
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(gutil.env.env === 'prod' ? uglify() : gutil.noop())
        .pipe(gulp.dest(config.js.dest));
}
jsExternal.description = 'Сборка external js';