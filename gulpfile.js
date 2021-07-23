const gulp        = require('gulp');
const concat      = require('gulp-concat');
const uglify      = require('gulp-uglify');
const beautify    = require('gulp-beautify');
const edit        = require('gulp-edit');
const minifyCss   = require('gulp-minify-css');
const replace     = require('gulp-replace');
const strnow      = require('strnow');
const packageinfo = require('packagejsondata');

gulp.task
(
	'default',
	() => 
	{
		const beautify_options = { 'indent_with_tabs': true, 'brace-style': 'expand' };

		return gulp
			.src
			(
				[
					'src/phpjs.js',
					'node_modules/mustache/mustache.min.js',
					'src/ums_mustache.js'
				]
			)
			.pipe(replace('CJS_DEBUG_MODE_1', 'CJS_DEBUG_MODE_0'))
			.pipe(beautify(beautify_options))
			.pipe(concat('jqueryUmsMustache.js'))
			.pipe
			(
				edit
				(
					(src, cb) =>
					{
						src = '// Version: ' + packageinfo.next() + ' - Last modified: ' + strnow.get() + '\n' + src;
						cb(null, src);
					}
				)
			)
			.pipe(gulp.dest('dist'))
			.pipe(gulp.dest('demo/js'))
			.pipe(uglify())
			.pipe(concat('jqueryUmsMustache.min.js'))
			.pipe
			(
				edit
				(
					(src, cb) =>
					{
						src = '// Version: ' + packageinfo.next() + ' - Last modified: ' + strnow.get() + '\n' + src;
						cb(null, src);
					}
				)
			)
			.pipe(gulp.dest('dist'))
			.pipe(gulp.dest('demo/js'))
		;
	}
);