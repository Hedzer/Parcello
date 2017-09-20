module.exports = function task_minify(cla) {
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
	const settings = cla.settings;
	const profile = cla.profile;
	const config = cla.settings.config;

	return gulp.task('minify', function(callback) {
		console.log('Minifying: ' + profile.build.file);
		return gulp.src(profile.build.full)
		.pipe(sourcemaps.init())
		.pipe(uglify({
			inSourceMap: profile.build.fullMap,
			outSourceMap: profile.build.minMap,
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
			addComment: true
		}))
		.pipe(gulp.dest(path.join(config.folders.build, settings.cache.version)));
	});
}