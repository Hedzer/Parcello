module.exports = function task_es6(cla) {
	const path = require('path');
	const fs = require('fs');
	const gulp = require('gulp');
	const sourcemaps = require('gulp-sourcemaps');
	const source = require('vinyl-source-stream');
	const buffer = require('vinyl-buffer');
	const babel = require('gulp-babel');
	const rollup = require('rollup-stream');
	const rollup_babel = require('rollup-plugin-babel');
	const rollup_alias = require('rollup-plugin-import-alias');
	const defaults = require('defaults-deep');
	const remaps = require('./bundle/remap');
	const profile = cla.profile;

	return gulp.task('bundle-es6', function(callback) {
		console.log('Building: ' + profile.build.file);
		return rollup({
			entry: profile.entry,
			format: 'iife',
			moduleName: profile.namespace,
			sourceMap: true,
			plugins: [
				rollup_alias({
					Paths: remaps(cla.directory, cla.here, profile.cache.maps, profile),
					Extensions: profile.extensions,
				})
			]
		})
		.pipe(source(profile.build.file))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write(path.join('../', cla.profile.cache.version)))
		.pipe(gulp.dest(path.join(profile.build.folder, cla.profile.cache.version)));
	});
}
