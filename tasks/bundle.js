module.exports = function bundle() {
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
	const util = require('gulp-util');
	const defaults = require('defaults-deep');
	const profile = cla.profile;

	return gulp.task('bundle', function(callback) {
		console.log('Building: ' + config.built.file);
		return rollup({
			entry: config.entry,
			format: 'iife',
			moduleName: config.namespace,
			sourceMap: true,
			plugins: [
				rollup_alias({
					Paths: config.aliases,
					Extensions: config.extensions,
				}),
				rollup_babel({
					presets: [
						[
							"es2015",
							{
								"modules": false
							}
						]
					],
					plugins: [
						"external-helpers",
						"syntax-trailing-function-commas"
					],
					exclude: 'node_modules/**'
				})
			]
		})
		.pipe(source(config.built.file))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(config.built.folder));
	});
}
