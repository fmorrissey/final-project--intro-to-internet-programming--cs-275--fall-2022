const { src, dest, series, watch } = require(`gulp`),
    CSSLinter = require(`gulp-stylelint`),
    babel = require(`gulp-babel`),
    htmlCompressor = require(`gulp-htmlmin`),
    cssCompressor = require (`gulp-clean-css`),
    jsCompressor = require(`gulp-uglify`),
    jsLinter = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;

let browserChoice = `default`;

async function chrome () {
    browserChoice = `google chrome`;
}

let lintJS = () => {
    return src([`js/main.js`])
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach(`compact`));
};

let transpileJSForDev = () => {
    return src(`js/main.js`)
        .pipe(babel())
        .pipe(dest(`temp/js`));
};

let compressHTML = () => {
    return src([`index.html`])
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let compressCSS = () => {
    return src([`styles/main.css`])
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};
let lintCSS = () => {
    return src(`dev/styles/css/**/*.css`)
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [
                {formatter: `string`, console: true}
            ]
        }));
};

let transpileJSForProd = () => {
    return src(`js/main.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `temp`,
                `prod`,
                `.`
            ]
        }
    });

    watch(`main.js`, series(lintJS, transpileJSForDev))
        .on(`change`, reload);

    watch(`main.css`, series(lintCSS, compressCSS))
        .on(`change`, reload);

};

exports.chrome = series(chrome, serve);
exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressHTML = compressHTML;
exports.transpileJSDev= transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.compressCSS = compressCSS;
exports.lintCSS = lintCSS;
exports.serve = series(
    lintJS,
    transpileJSForDev,
    serve
);
exports.build = series(
    compressHTML,
    transpileJSForProd,
    compressCSS
);
