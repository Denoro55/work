'use strict';
 
const gulp = require('gulp');
const gp = require("gulp-load-plugins")();
const browserSync = require('browser-sync').create();
const fs = require('fs');
const del = require('del');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const nodemon = require('gulp-nodemon');

const src = "./src/";
const dist = "./dist/";

const srcPath = {
	pug:    `${src}*.pug`,
	js:     `${src}scripts/index.js`,
	scss:   `${src}styles/**/*.*`,
	img:    `${src}images/**/*`,
	fonts:  `${src}fonts/**/*.*`
};

const distPath = {
	js:     `${dist}assets/scripts/`,
	css:    `${dist}assets/styles/`,
	img:    `${dist}assets/images/`,
	fonts:  `${dist}assets/fonts/`
};

const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
 
gulp.task("js", () => {
  return gulp.src(srcPath.js)
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest(distPath.js))
});

gulp.task('sass',function(){
	return gulp.src(srcPath.scss)
	.pipe(gp.sourcemaps.init())
	.pipe(gp.sassGlob())
	.pipe(gp.sass())
	.pipe(gp.csso())
	.on('error',gp.notify.onError({
		title: "Styles Error"
	}))
	.pipe(gp.autoprefixer({
		browsers: [
		'last 15 version','>1%','ie 8','ie 9','Opera 12.1'
		]
	}))

	// .pipe($.gp.cssUnit({
	// 	type: 'px-to-rem',
	// 	rootSize: 16
	// }))

	.pipe(gp.sourcemaps.write())
	.pipe(gulp.dest(distPath.css));
})

gulp.task("pug", () => {
  return gulp.src(srcPath.pug)
		.pipe(gp.pug({
			locals: JSON.parse(fs.readFileSync('./content.json', 'utf8')), 
			pretty: true 
		}))
		.on("error", gp.notify.onError((err) => {
			return {
				title: "Pug",
				message: err.message
			}
		}))
		.pipe(gulp.dest(dist))
});

gulp.task("clean", () => {
	return del('./dist/assets');
});

// копирование шрифтов

gulp.task("font:copy", () => {
	return gulp.src(srcPath.fonts)
	.pipe(gulp.dest(distPath.fonts))
});

// копирование img

// gulp.task("clear", () => {
// 	return cache.clearAll();
// });

gulp.task('img:copy', () => {
    return gulp.src(srcPath.img)
    .pipe(imagemin([
        pngquant(),
        mozjpeg({
            progressive: true
        })
    ],{
        verbose: true
    }))
    .pipe(gulp.dest(distPath.img))
});

// gulp.task('img:copy', () => {
//     return gulp.src(srcPath.img)
//     .pipe(gp.imagemin({
//     	interplace: true,
//     	progressive: true,
//     	svgoPlugins: [{removeViewBox: false}],
//     	une: [pngquant()]
//     }))
//     .pipe(gulp.dest(distPath.img))
// });
 
gulp.task('watch', function () {
  gulp.watch('./src/styles/**/*.scss', gulp.series("sass"));
  gulp.watch(`./src/scripts/**/*.js*`, gulp.series("js"));
  gulp.watch(`./src/*.pug*`, gulp.series("pug"));
  // gulp.watch(`${src}images/**/*`, gulp.series("img:copy"));
});

// gulp.task("serve", () => {
// 	bs.init({
// 		open: true,
// 		server: dist
// 	});
// 	bs.watch(`${dist}/**/*.*`).on("change", bs.reload);
// });

gulp.task('serve', function() {
	browserSync.init({
		open: true,
		proxy: "http://localhost:4000",
        files: ["dist/assets/**/*.*"],
        port: 8080,
	});
	browserSync.watch([`${dist}/**/*.*`,'./dist/*.pug']).on("change", browserSync.reload);
});

gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});

gulp.task("default", gulp.series(
	'clean',
	gulp.parallel("pug","sass","js","font:copy","img:copy"),
	'nodemon',
	gulp.parallel("watch","serve")
));

// gulp.task("default", gulp.series(
// 	'clean',
// 	gulp.parallel("pug","sass","js","font:copy","img:copy"),
// 	'nodemon',
// 	gulp.parallel("watch","serve")
// ));