import gulp from 'gulp';
import config from '../config'

/*
 * Смотрит за изменениями
 */

function watch() {
    gulp.watch(config.watch.html, gulp.series('html'));
    gulp.watch(config.watch.cssInternal, gulp.series('postcssInternal'));
    gulp.watch(config.watch.cssExternal, gulp.series('postcssExternal'));
    gulp.watch(config.watch.jsInternal, gulp.series('jsInternal'));
    gulp.watch(config.watch.jsExternal, gulp.series('jsExternal'));
    gulp.watch(config.watch.images, gulp.series('images'));
    gulp.watch(config.watch.svgSprite, gulp.series('spriteSvg'));
    gulp.watch(config.watch.fonts, gulp.series('fonts'));
};
watch.description = 'Смотрит за изменениями файлов';

export default watch;