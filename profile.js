'use strict';

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
		let max = 10000;
		let mapper = (n) => { return n.match(numbers); };
		let reducer = (current, value, index) => {
			return current + value * (max / Math.pow(10, index));
		};
		folders.sort((a, b) => {
			a = a.split('.').map(mapper).reduce(reducer, 0);
			b = b.split('.').map(mapper).reduce(reducer, 0);
			return (b - a);
		});
		version = folders[0];
	}

	let isPolyfilled = !!cla.options.polyfilled;

	config.entry = path.join(source, version, isPolyfilled ? config.source.polyfilled : config.source.file);
	config.built = (config.built || {});
	config.built.folder = path.join(root, config.built.folder);

	//generte full path
	let full = path.join(config.built.folder, config.built.file);
	config.built.full = full;
	config.built.fullMap = full + '.map';

	//generate minned path
	let builtExt = path.extname(full);
	let min = full.substring(0, full.length - builtExt.length) + '.min' + builtExt;
	config.built.min = min;
	config.built.minMap = min + '.map';

	hasTransformed = true;
	cached = config;

	return config;
}

