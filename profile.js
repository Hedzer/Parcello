'use strict';


module.exports = function build_config(cwd, config, profileName, cla) {
	const fs = require('fs');
	const path = require('path');
	const defaults = require('defaults-deep');
	const toSemver = require('to-semver');
	const jsonfile = require('jsonfile');
	const clone = require('clone');
	const opath = require('object-path');
	const semversioned = require('./profile/semversioned');
	const chalk = require('chalk');
	const root = cwd;
	
	if (!config) { return false; }

	let source = path.join(root, config.folders.source);
	if (!fs.existsSync(source)) {
		console.log(chalk.bold.red('Source folder does not exist.'));
		return Error;
	}


	//get version
	let version = cla.version; //add default build version
	if (Array.isArray(version)) { version = false; }
	if (!version && version !== 0) {
		let folders = fs.readdirSync(source).filter(dir => fs.statSync(path.join(source, dir)).isDirectory());
		if (folders.length) {
			version = toSemver(folders, { includePrereleases: true, clean: false })[0];
		} else {
			console.log(chalk.bold.red('No version folders found.'));
			return Error;
		}
	}

	let versionPath = path.join(source, version);
	if (!fs.existsSync(versionPath)) {
		console.log(chalk.bold.red(`Version '${version}' does not exist.`));
		return Error;
	}

	let versioned = semversioned(config, profileName, version);
	console.log('Selected source version: ' + version);
	console.log('Selected build profile: ' + versioned.using);

	let settings = versioned;
	let profile = opath.get(settings, 'profile', {});
	settings.cache = {
		maps: {},
		version: version || 'none'
	};

	//convert maps to absolute
	if (opath.has(profile, 'dependency.remap')) {
		let remap = opath.get(profile, 'dependency.remap', {});
		Object.keys(remap).forEach((key) => {
			settings.cache.maps[key] = path.join(root, remap[key]);
		});
	}

	profile.entry = path.join(cwd, config.folders.source, version, profile.source.file); //needs fallback later
	opath.set(profile, 'build.folder', path.join(root, config.folders.build));

	//generate full path
	let full = path.join(cwd, config.folders.build, version, profile.build.file);
	opath.set(profile, 'build.full', full);
	opath.set(profile, 'build.fullMap', full + '.map');

	//generate minned path
	let builtExt = path.extname(full);
	let min = full.substring(0, full.length - builtExt.length) + '.min' + builtExt;
	opath.set(profile, 'build.min', min);
	opath.set(profile, 'build.minMap', min + '.map');

	return settings;
}

