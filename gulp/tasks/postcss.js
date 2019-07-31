import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import browsersync from 'browser-sync';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import prefixer from 'gulp-autoprefixer';
import gulpPostcss from 'gulp-postcss';
import cssnano from 'gulp-cssnano';
import inlineSvg from 'postcss-inline-svg';
import atImport from 'postcss-import';
import precss from 'precss';
import mixins from 'postcss-sassy-mixins';
import lost from 'lost';
import next from 'postcss-cssnext';
import pxtorem from 'postcss-pxtorem';
import hexrgba from 'postcss-hexrgba';
import config from '../config';

/*
 * Компиляция POSTCSS в CSS
 * Создание sourcemaps
 * Минификация
 */

const processors = [
    atImport(),
    mixins(),
    precss(),
    lost(),
    pxtorem(),
    hexrgba(),
    inlineSvg(config.svg.svgInStyle),
    next()
];



export function postcssInternal() {
    browsersync.notify('Compiling CSS internal');

    return gulp.src(config.css.srcInternal)
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: 'CSS internal',
                message: err.toString()
            }))
        }))
        .pipe(gutil.env.env === 'prod' ? gutil.noop() : sourcemaps.init())
        .pipe(gulpPostcss(processors))
        .pipe(prefixer())
        .pipe(gutil.env.env === 'prod' ? cssnano(config.cssnano) : gutil.noop())
        .pipe(rename({extname: '.css'}))
        .pipe(gutil.env.env === 'prod' ? gutil.noop() : sourcemaps.write('.'))
        .pipe(gulp.dest(config.css.dest));
};
postcssInternal.description = 'Сборка internal css';


export function postcssExternal() {
    browsersync.notify('Compiling CSS external');

    return gulp.src(config.css.srcExternal)
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: 'CSS external',
                message: err.toString()
            }))
        }))
        .pipe(gutil.env.env === 'prod' ? gutil.noop() : sourcemaps.init())
        .pipe(gulpPostcss([atImport()]))
        .pipe(gutil.env.env === 'prod' ? cssnano(config.cssnano) : gutil.noop())
        .pipe(rename({extname: '.css'}))
        .pipe(gutil.env.env === 'prod' ? gutil.noop() : sourcemaps.write('.'))
        .pipe(gulp.dest(config.css.dest));
};
postcssExternal.description = 'Сборка external css';
