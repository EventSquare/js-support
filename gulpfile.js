var gulp = require('gulp');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var concat = require("gulp-concat");
var cleancss = require('gulp-clean-css');
var minify = require('gulp-minify');
var del = require('del');

// Sass
gulp.task('sass', function() {
	gulp
		.src([
			'./src/scss/app.scss',
		])
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('support.min.css'))
        .pipe(cleancss({compatibility: 'ie8'}))
		.pipe(gulp.dest('./dist'));
});

// Javascript
gulp.task('javascript', function() {
	return gulp.src([
		'./src/js/app.js'
	])
	.pipe(concat('support.js'))
	.pipe(minify({
        ext:{
			source: '.js',
            min:'.min.js'
        }
    }))
	.pipe(gulp.dest('./dist'));
});

gulp.task('images', function() {
	del.sync(['./dist/images/**', '!./dist/images']);
	gulp.src(['./src/images/**/*']).pipe(gulp.dest('./dist/images'));
});

// Watch task
gulp.task('default',function() {
	gulp.watch(['src/scss/**/*.scss'],['sass']);
	gulp.watch(['src/js/**/*.js'],['javascript']);
	gulp.watch(['src/images/**/*'],['images']);
});
