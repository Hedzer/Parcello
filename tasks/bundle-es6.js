module.exports = function bundle_es6(cla) {
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
	const profile = cla.profile;

	return gulp.task('bundle-es6', function(callback) {
		console.log('Building: ' + profile.built.file);
		return rollup({
			entry: profile.entry,
			format: 'iife',
			moduleName: profile.namespace,
			sourceMap: true,
			plugins: [
				rollup_alias({
					Paths: profile.aliases,
					Extensions: profile.extensions,
				})
			]
		})
		.pipe(source(profile.built.file))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(profile.built.folder));
	});
}
