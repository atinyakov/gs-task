import gulp from 'gulp'
import rimraf from 'rimraf'
import config from '../config'


/*
 * Удаление папки build
 */

function clean(done) {
    rimraf(config.clean.dest, done);
}
clean.description = 'Удаляет build директорию';

export default clean;