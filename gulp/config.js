import gulp from 'gulp';
import gutil from 'gulp-util';

const developmentDir = 'build/',
    productionDir  = '../public/assets/build/';

const path = {
    dest: gutil.env.env === 'prod' ? productionDir : developmentDir,

    build: {
        html: developmentDir,

        js: 'js/',

        css: 'css/',

        img: 'img/',
        sprite: 'src/img/',
        svgSprite: 'img/svg/',

        fonts: 'fonts/'
    },
    src: {
        html: 'src/*.html',

        jsInternal: 'src/js/internal.js',
        jsExternal: 'src/js/external.js',

        styleInternal: gutil.env.env === 'prod' ? 'src/style/internal.pcss' : ['src/style/internal.pcss', 'src/style/ui_kit.pcss'],
        styleExternal: 'src/style/external.pcss',
        styleInclude: ['src/style/', './bower_components'],

        img: ['src/img/**/*.*', '!src/img/sprite/**/*.*', '!src/img/svg/sprite/**/*.*'],
        imgProduction: ['src/img/**/*.*', '!src/img/sprite/**/*.*', '!src/img/svg/sprite/**/*.*', '!src/img/inhtml/**/*.*'],
        sprite: 'src/img/sprite/**/*.*',
        svg: 'src/img/svg/',

        svgSpriteBuild: 'src/img/svg/',
        svgSprite: 'src/img/svg/sprite/*.svg',
        generatedSvgSprite: 'src/img/svg/sprite.svg',

        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',

        jsInternal: ['src/js/**/*.js', '!src/js/**/external.js', '!src/js/vendor/**/*.js'],
        jsExternal: ['src/js/**/external.js', 'src/js/vendor/**/*.js'],

        styleInternal: ['src/style/**/*.pcss', 'src/style/**/internal.pcss', '!src/style/**/external.pcss'],
        styleExternal: 'src/style/external.pcss',

        img: ['src/img/**/*.*', '!src/img/svg/sprite/**/*.*', '!src/img/svg/sprite.svg'],

        svgSprite: 'src/img/svg/sprite/*.svg',

        fonts: 'src/fonts/**/*.*'
    }
};

const config = {
    browsersync: {
        server: {
            baseDir: `./${developmentDir}`
        },
        tunnel: false,
        open: false,
        host: 'localhost',
        port: 3000,
        logPrefix: 'Blank'
    },
    html: {
        src: path.src.html,
        dest: path.build.html
    },
    js: {
        srcInternal: path.src.jsInternal,
        srcExternal: path.src.jsExternal,
        dest: `${path.dest}${path.build.js}`,
        destJquery: `${path.dest}${path.build.jquery}`
    },
    css: {
        srcInternal: path.src.styleInternal,
        srcExternal: path.src.styleExternal,
        options: {
            includePaths: path.src.styleInclude,
            sourceMap: true,
            errLogToConsole: true
        },
        dest: `${path.dest}${path.build.css}`
    },
    images: {
        src: path.src.img,
        srcProduction: path.src.imgProduction,
        dest: `${path.dest}${path.build.img}`
    },
    svg: {
        svgInStyle: {
            path: path.src.svg
        },
        sprite: path.src.svgSprite,
        spriteGenerateDest: path.src.svgSpriteBuild,
        spriteDest: path.dest + path.build.svgSprite,
        generated: path.src.generatedSvgSprite
    },
    sprites: {
        imagePath: path.src.sprite,
        spritePath: path.build.sprite
    },
    fonts: {
        src: path.src.fonts,
        dest: path.dest + path.build.fonts
    },
    watch: {
        html: path.watch.html,
        jsInternal: path.watch.jsInternal,
        jsExternal: path.watch.jsExternal,
        cssInternal: path.watch.styleInternal,
        cssExternal: path.watch.styleExternal,
        images: path.watch.img,
        svgSprite: path.watch.svgSprite,
        fonts: path.watch.fonts
    },
    clean: {
        dest: `./${path.dest}`
    },
    cssnano: {
        zindex: false,
        svgo: false, // svgo отключен из-за ie11
        autoprefixer: false,
        reduceIdents: false
    },
    uglify: {
        mangle: {
            keep_fnames: true
        },
        compress: {
            // unsafe: false,
            // unsafe_Func: false,
            unsafe_comps: false,
            unsafe_math: false,
            unsafe_proto: false,
            unsafe_regexp: false,
            typeofs: false,
            reduce_vars: false,
            reduce_funcs: false,
            pure_getters: true,
            properties: false,
            collapse_vars: false
        }
    }
};

export default config;
