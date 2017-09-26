module.exports = function task_bundle(cla) {
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
	const externalHelpers = require('babel-plugin-external-helpers');
	const trailingCommas = require('babel-plugin-syntax-trailing-function-commas');
	const settings = cla.settings;
	const profile = cla.profile;
	const config = cla.settings.config;
	const node_modules = path.join(cla.here, 'node_modules');
	const es2015 = path.join(node_modules, 'babel-preset-es2015');

	let maps = remaps(cla.directory, cla.here, settings.cache.maps, settings) || [];
	return gulp.task('bundle', function(callback) {
		console.log('Building: ' + profile.build.file);
		return rollup({
			input: profile.entry,
			format: 'umd',
			name: config.namespace,
			sourcemap: true,
			plugins: [
				rollup_alias({
					Paths: maps,
					Extensions: profile.extensions,
				}),
				rollup_babel({
					babelrc: false,
					presets: [
						[
							es2015,
							{
								"modules": false
							}
						]
					],
					plugins: [
						externalHelpers,
						trailingCommas
					],
					exclude: 'node_modules/**'
				})
			]
		})
		.pipe(source(profile.build.file))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(path.join(config.folders.build, settings.cache.version)));
	});
}
