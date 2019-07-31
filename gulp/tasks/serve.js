import gulp from 'gulp'
import browsersync from 'browser-sync'
import config from '../config'

/*
 * Запуск вебсервера BrowserSync
 */

function serve(done) {
    const serveCreate = browsersync.create();
    serveCreate.init(config.browsersync);
}
serve.description = 'Запускает вебсервер из директории /build';

export default serve;