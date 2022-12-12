const { src, dest, series, watch } = require(`gulp`),
    CSSValidator = require(`gulp-stylelint`),
    babel = require(`gulp-babel`),
    htmlCompressor = require(`gulp-htmlmin`),
    cssCompressor = require (`gulp-clean-css`),
    jsCompressor = require(`gulp-uglify`),
    jsValidator = require(`gulp-eslint`),
    htmlValidator = require(`gulp-html`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;

let browserChoice = `default`;

async function chrome () {
    browserChoice = `google chrome`;
}

let compressJS = () => {
    return src(`scripts/main.js`)
        .pipe(babel())
        .pipe(jsCompressor());
        .pipe(dest('prod/scripts'));
};

let validateJS = () => {
    return src([`scripts/main.js`,'gulpfile.js])
        .pipe(jsValidator());
        .pipe(jsValidator.formatEach('compact' process.stderr'));
};

let transpileJSForDev = () => {
    return src(`scripts/main.js`)
        .pipe(babel())
        .pipe(dest(`temp/scripts`));
};

let compressHTML = () => {
    return src(`index.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};
let validateHTML = () => {
    return src(`index.html`)
        .pipe(htmlValidator());
};

let compressCSS = () => {
    return src(`styles/main.css`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod/styles`));
};

let validateCSS = () => {
    return src(`styles/main.css`)
        .pipe(cssValidator({
            failAfterError: false,
            reporters: [
                {formatter: `verbose`, console: true}
            ]
        }));
};

let transpileJSForProd = () => {
    return src(`scripts/main.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/scrpits`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `./`
            ]
        }
    });

    watch(`scripts/main.js`, series(validateJS, transpileJSForDev)).on(`change`, reload);
    watch(`styles/main.css`,validateCSS).on(`change`, reload);
    watch(`index.html`).on(`change`, reload);

};

exports.chrome = series(chrome, serve);
exports.compressJS = compressJS;
exports.validateJS = validateJS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressHTML = compressHTML;
exports.validateHTML = validateHTML;
exports.transpileJSDev= transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.compressCSS = compressCSS;
exports.validateCSS = validateCSS;
exports.serve = series(
    validateJS,
    transpileJSForDev,
    validateCSS,
    valiadteHTML,
    serve
);
exports.build = series(
    compressHTML,
    transpileJSForProd,
    compressCSS
);
