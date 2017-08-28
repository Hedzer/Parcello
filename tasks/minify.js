function build_minify(cla) {
	const path = require('path');
	const fs = require('fs');
	const gulp = require('gulp');
	const sourcemaps = require('gulp-sourcemaps');
	const source = require('vinyl-source-stream');
	const buffer = require('vinyl-buffer');
	const uglify = require('gulp-uglify');
	const rename = require('gulp-rename');
	const dereserve = require('gulp-dereserve');
	const defaults = require('defaults-deep');
	const profile = cla.profile;

	return gulp.task('minify', function(callback) {
		console.log('Minifying: ' + profile.built.file);
		return gulp.src(profile.built.full)
		.pipe(sourcemaps.init())
		.pipe(uglify({
			inSourceMap: profile.built.fullMap,
			outSourceMap: profile.built.minMap,
			mangle: {
				toplevel: true,
				screw_ie8: true
			},
			compress: {
				screw_ie8: true,
				sequences: true,
				properties: true,
				dead_code: true,
				drop_debugger: true,
				comparisons: true,
				conditionals: true,
				evaluate: true,
				booleans: true,
				loops: true,
				unused: true,
				hoist_funs: true,
				if_return: true,
				join_vars: true,
				cascade: true,
			}
		}))
		.pipe(dereserve())
		.pipe(rename(function(path) {
			if (path.extname === '.js') {
				path.extname = ".min.js"
			}
		}))
		.pipe(sourcemaps.write('./', {
			addComment: false
		}))
		.pipe(gulp.dest(profile.built.folder));
	});
}