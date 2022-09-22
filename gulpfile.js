/*Reference : https://www.pixemweb.com/blog/gulp-4-0-0-with-nodejs-imagemin-browsersync-sass-sourcemaps-cleancss-more/ */

// You can declare multiple variables with one statement by starting with var and seperate the variables with a comma and span multiple lines.
// Below are all the Gulp Plugins we're using.
const gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  browserSync = require("browser-sync").create(),
  reload = browserSync.reload,
  sass = require('gulp-sass')(require('sass')),
  concat = require("gulp-concat"),
  imagemin = require("gulp-imagemin"),
  changed = require("gulp-changed"),
  lineec = require("gulp-line-ending-corrector"),
  sourcemaps = require("gulp-sourcemaps"),
  jshint = require("gulp-jshint"),
  uglify = require("gulp-uglify-es").default;

const root = "./",
  scss = root + "assets/scss/",
  js = root + "assets/js/",
  jsDist = root + "dist/js/";

const phpWatchFiles = root + "**/*.php",
  styleWatchFiles = scss + "**/*.scss";


const jsSrc = [
  js + "main.js",
];

var imgSRC = root + "assets/images/**/*",
  imgDEST = root + "dist/images/";

var fontsSRC = root + "assets/fonts/**/*",
  fontsDEST = root + "dist/fonts";

function imgmin() {
  return gulp
    .src(imgSRC)
    .pipe(changed(imgDEST))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg ({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(gulp.dest(imgDEST));
}

function css() {
  return gulp
    .src(scss + "main.scss", { sourcemaps: true })
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer("last 2 versions"))
    .pipe(lineec())
    .pipe(gulp.dest("dist/css", { sourcemaps: "." }));
}

function criticalCss() {
  return gulp
    .src(scss + "critical.scss", { sourcemaps: true })
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer("last 2 versions"))
    .pipe(lineec())
    .pipe(gulp.dest("dist/css", { sourcemaps: "." }));
}

function fonts() {
  return gulp.src(fontsSRC).pipe(gulp.dest(fontsDEST));
}

function javascript() {
  return (
    gulp
      .src(jsSrc, {allowEmpty:true})
      .pipe(concat("app.min.js"))
      .pipe(sourcemaps.init())
      .pipe(jshint())
      // .pipe( jshint.reporter( "jshint-stylish" ) )
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(jsDist))
  );
}

function watch() {
  browserSync.init({
    open: "external",
    proxy: "http://localhost/projets/SitePulse",
  });
  gulp.watch(styleWatchFiles, css);
  gulp.watch(styleWatchFiles, criticalCss);
  gulp.watch(imgSRC, imgmin);
  gulp.watch(jsSrc, javascript);
  gulp
    .watch([phpWatchFiles, jsDist + "devwp.js", root + "/dist/css/main.css"])
    .on("change", reload);
}

exports.css = css;
exports.criticalCss = criticalCss;
exports.javascript = javascript;
exports.watch = watch;
exports.imgmin = imgmin;
exports.fonts = fonts;

const build = gulp.series(
  css,
  criticalCss,
  javascript,
  javascriptSectionIndex,
  imgmin,
  fonts
);
gulp.task("build", build);
