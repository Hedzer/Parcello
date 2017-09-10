'use strict';

const fs = require('fs-extra');
const path = require('path');
const jsonfile = require('jsonfile');
const opath = require('object-path');
const defaults = require('defaults-deep');
const crc = require('crc');

//this function is too big/messy, and will need to be pulled apart later
module.exports = function aliases(cwd, here, additional) { //will need to do a non-sync version later, maybe cache?
	if (typeof additional !== 'object' || additional === null) { additional = {}; }
	let packages = { '/Parcello': here };

	//create cache if it doesn't exist
	let cacheId = crc.crc32(cwd).toString(16);
	let cachePath = path.join(here, 'cache');
	let cacheFile = path.join(cachePath, `${cacheId}.json`);
	let cacheContents = {
		modified: false,
		aliases: {},
	};

	let cacheModified = false;
	if (!fs.existsSync(cachePath)) {
		fs.ensureDirSync(cachePath);
	}
	if (fs.existsSync(cacheFile)) {
		cacheContents = jsonfile.readFileSync(cacheFile);
		cacheModified = opath.get(cacheContents, 'modified');
	}
	let modules = path.join(cwd, 'node_modules');
	if (!fs.existsSync(modules)) {
		return defaults(packages, additional);
	}

	let nodes = fs.readdirSync(modules);

	let combinedMTime = [];
	let folders = nodes.sort().filter((node) => {
		let stat = fs.statSync(path.join(cwd, 'node_modules', node));
		let isDirectory = stat.isDirectory();
		if (isDirectory) {
			try {
				let stat = fs.statSync(path.join(cwd, 'node_modules', node, 'package.json'));
				combinedMTime.push(opath.get(stat, 'mtime'));
			} catch(e) {}
		}
		return isDirectory;
	});

	//verify cache. hash the additional aliases + mtime of packages
	let aliasChecksum = crc.crc32(crc.crc32(Object.keys(additional).sort().reduce((result, current) => {
		result.push([current, additional[current]].join());
		return result;
	}, []).join()).toString(16) + crc.crc32(combinedMTime.join()).toString(16) + crc.crc32(here)).toString(16);
	if (aliasChecksum === cacheModified) {
		return cacheContents.aliases;
	}


	//get new aliases
	folders.forEach((folder) => {
		let folderPath = path.join(cwd, 'node_modules', folder);
		let packagePath = path.join(folderPath, 'package.json');
		if (fs.existsSync(packagePath)) {
			packages[`/${folder}`] = folderPath;
			let obj = jsonfile.readFileSync(packagePath);
			if (!opath.has(obj, 'parcello.namespace')) { return; }

			let namespace = opath.get(obj, 'parcello.namespace');
			if (!namespace) { return; }

			packages[`/${namespace}`] = folderPath;
		}
	});
	let aliases = defaults(packages, additional);

	//write to cache
	cacheContents = {
		modified: aliasChecksum,
		aliases: aliases,
	};
	jsonfile.writeFile(cacheFile, cacheContents, { spaces: 2 }, () => {});
	
	return aliases;
}
