import gulp from 'gulp';
import gutil from 'gulp-util';

import serve from './gulp/tasks/serve';
import watch from './gulp/tasks/watch';
import clean from './gulp/tasks/clean';
import html from './gulp/tasks/html';
import fonts from './gulp/tasks/fonts';
import images from './gulp/tasks/images';
import {cleanSvgSprite, generateSvgSprite, copySvgSprite} from './gulp/tasks/sprite_svg';
import {jsInternal, jsExternal} from './gulp/tasks/js';
import {postcssInternal, postcssExternal} from './gulp/tasks/postcss';


gulp.task(serve);
gulp.task(watch);
gulp.task(clean);
gulp.task(html);
gulp.task(fonts);
gulp.task(images);
gulp.task(cleanSvgSprite);
gulp.task(generateSvgSprite);
gulp.task(copySvgSprite);
gulp.task(jsInternal);
gulp.task(jsExternal);
gulp.task(postcssInternal);
gulp.task(postcssExternal);


gulp.task('js', gulp.parallel('jsInternal', 'jsExternal'));
gulp.task('postcss', gulp.parallel('postcssInternal', 'postcssExternal'));
gulp.task('spriteSvg', gulp.series('cleanSvgSprite', gulp.parallel('generateSvgSprite'), 'copySvgSprite', 'html'));


gulp.task('build', gutil.env.env === 'prod' ? gulp.series('clean', gulp.parallel('jsInternal', 'jsExternal', 'postcssInternal', 'postcssExternal', 'spriteSvg', 'fonts'), 'images') : gulp.series('clean', gulp.parallel('jsInternal', 'jsExternal', 'postcssInternal', 'postcssExternal', 'spriteSvg', 'fonts'), 'html', 'images'));

gulp.task('default', gutil.env.env === 'prod' ? gulp.series('build') : gulp.series('build', gulp.parallel('serve', 'watch')));
