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
	const settings = cla.settings;
	const profile = cla.profile;
	const config = cla.settings.config;

	return gulp.task('bundle', function(callback) {
		console.log('Building: ' + profile.build.file);
		return rollup({
			input: profile.entry,
			format: 'umd',
			name: config.namespace,
			sourcemap: true,
			plugins: [
				rollup_alias({
					Paths: remaps(cla.directory, cla.here, settings.cache.maps, settings),
					Extensions: profile.extensions,
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
		.pipe(source(profile.build.file))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(path.join(config.folders.build, settings.cache.version)));
	});
}
