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
	const rollup_node_resolve = require('rollup-plugin-node-resolve');
	const defaults = require('defaults-deep');
	const remaps = require('./bundle/remap');
	const virtuals = require('./bundle/virtuals')(cla);
	const settings = cla.settings;
	const profile = cla.profile;
	const config = cla.settings.config;

	let maps = remaps(cla.directory, cla.here, settings.cache.maps, settings) || [];
	return gulp.task('bundle-es6', function(callback) {
		console.log('Building: ' + profile.build.file);
		return rollup({
			input: profile.entry,
			format: 'umd',
			name: config.namespace,
			sourcemap: true,
			plugins: [
				virtuals,
				rollup_node_resolve(),
				rollup_alias({
					Paths: maps,
					Extensions: profile.extensions,
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
