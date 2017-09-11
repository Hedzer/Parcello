'use strict';


module.exports = function build_config(cwd, build, profile, cla) {
	const fs = require('fs');
	const path = require('path');
	const defaults = require('defaults-deep');
	const toSemver = require('to-semver');
	const jsonfile = require('jsonfile');
	const clone = require('clone');
	const opath = require('object-path');
	const root = cwd;
	
	if (!build) { return false; }
	let hasTransformed = false;

	let cached;

	if (hasTransformed) { return cached; }

	let config = clone(defaults((build[profile] || {}), build.default));
	config.cache = {
		maps: {},
		version: 'none'
	};

	//convert maps to absolute
	if (opath.has(config, 'dependency.remap')) {
		Object.keys(opath.get(config, 'dependency.remap', {})).forEach((key) => {
			config.cache.maps[key] = path.join(root, config.dependency.remap[key]);
		});
	}

	let source = path.join(root, config.source.folder);
	if (!fs.existsSync(source)) {
		return false;
	}

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

	config.cache.version = version;
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

