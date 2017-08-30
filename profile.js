'use strict';

const toSemver = require('to-semver');

module.exports = function get_profile(cwd, profile, cla) {
	const fs = require('fs');
	const path = require('path');
	const defaults = require('defaults-deep');
	const root = cwd;
	let build = require(path.join(root,'parcello.json'));
	let hasTransformed = false;

	let cached;

	if (hasTransformed) { return cached; }

	let config = defaults((build[profile] || {}), build.default);

	//convert aliases to absolute
	Object.keys(config.aliases || {}).forEach((key) => {
		config.aliases[key] = path.join(root, config.aliases[key]);
	});

	let source = path.join(root, config.source.folder);

	//get version
	let version = cla.options.version;
	let numbers = /\d+/g;
	if (!version && version !== 0) {
		let folders = fs.readdirSync(source).filter(dir => fs.statSync(path.join(source, dir)).isDirectory());
		if (folders.length) {
			version = toSemver(folders, { includePrereleases: true, clean: false })[0];
		} else {
			console.log('No version folders found.');
		}
	}
	console.log('Selected version: ' + version);

	let isPolyfilled = !!cla.options.polyfilled;

	config.entry = path.join(source, version, isPolyfilled ? config.source.polyfilled : config.source.file);
	config.build = (config.build || {});
	config.build.folder = path.join(root, config.build.folder);

	//generte full path
	let full = path.join(config.build.folder, config.build.file);
	config.build.full = full;
	config.build.fullMap = full + '.map';

	//generate minned path
	let builtExt = path.extname(full);
	let min = full.substring(0, full.length - builtExt.length) + '.min' + builtExt;
	config.build.min = min;
	config.build.minMap = min + '.map';

	hasTransformed = true;
	cached = config;

	return config;
}

