import gulp from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import rimraf from 'rimraf';
import svgSprite from 'gulp-svg-sprites';
import config from '../config'


/*
 * Удаляет svg спрайт /src/img/svg/sprite.svg
 */

export function cleanSvgSprite(done) {
    rimraf(config.svg.generated, done);
};
cleanSvgSprite.description = 'Удаляет svg спрайт';

/*
 * Генрит svg спрайт из файлов /src/img/svg/sprite/*.svg
 */

export function generateSvgSprite(done) {
    return gulp.src(config.svg.sprite)
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: 'Svg sprite',
                message: err.toString()
            }))
        }))
        .pipe(svgSprite({
            mode: 'symbols',
            selector: 'icon-%f',
            cssFile: false,
            svg: {
                sprite: 'sprite.svg',
                symbols: 'sprite.svg'
            },
            preview: false
        }))
        .pipe(gulp.dest(config.svg.spriteGenerateDest));
};
generateSvgSprite.description = 'Создает svg спрайт';


export function copySvgSprite(done) {
    gulp.src(config.svg.generated)
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: 'Copy svg sprite',
                message: err.toString()
            }))
        }))
        .pipe(gulp.dest(config.svg.spriteDest));

    done();
};
copySvgSprite.description = 'Копирует svg спрайт в /build директорию';