import gulp from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import config from '../config'

/*
 * Копирование шрифтов
 */


function fonts(done) {
    gulp.src(config.fonts.src)
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: 'Fonts',
                message: err.toString()
            }))
        }))
        .pipe(gulp.dest(config.fonts.dest));

    done();
}
fonts.description = 'Копирует шрифты в /build директорию';

export default fonts;