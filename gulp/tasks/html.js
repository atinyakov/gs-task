import gulp from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import browsersync from 'browser-sync';
import fileinclude from 'gulp-file-include';
import config from '../config'

/*
 * Сборка html
 */

function html(done) {
    browsersync.notify('Compiling html');

    return gulp.src(config.html.src)
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: 'HTML',
                message: err.toString()
            }))
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(gulp.dest(config.html.dest));
}
html.description = 'Сборка html';

export default html;