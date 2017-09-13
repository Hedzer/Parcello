'use strict';

const fs = require('fs-extra');
const path = require('path');
const jsonfile = require('jsonfile');
const opath = require('object-path');
const defaults = require('defaults-deep');
const crc = require('crc');

//this function is too big/messy, and will need to be pulled apart later
module.exports = function remap(cwd, here, additional, profile) { //will need to do a non-sync version later, maybe cache?
	if (typeof additional !== 'object' || additional === null) { additional = {}; }


	let packages = { '/Parcello': here };
	let canSearch = opath.get(profile, 'dependency.search.active', true);
	let useCache = opath.get(profile, 'dependency.search.cache', true);
	if (opath.has(profile, 'namespace')) {
		let namespace = opath.get(profile, 'namespace');
		packages[`/${namespace}`] = cwd;
	}
	let cwdName = cwd.match(/([^\/]*)\/*$/)[1];
	packages[`/${cwdName}`] = cwd;

	//aggregate folders we're going to search through
	let defaultFolder = opath.get(profile, 'dependency.folder', 'dependencies');
	let searchableFolders = (canSearch ? opath.get(profile, 'dependency.search.folders', []) : []);
	// we reverse them so that when they are added as a map the last ones are actually the highest priority
	let searchFolders =  ([defaultFolder].concat(searchableFolders)).reverse();

	//create cache if it doesn't exist
	let cacheId = crc.crc32(cwd).toString(16);
	let cachePath = path.join(here, 'cache');
	let cacheFile = path.join(cachePath, `${cacheId}.json`);
	let cache = {
		modified: false,
		maps: {},
	};

	let modified = false;
	if (!fs.existsSync(cachePath)) {
		fs.ensureDirSync(cachePath);
	}
	if (fs.existsSync(cacheFile)) {
		cache = jsonfile.readFileSync(cacheFile);
		modified = opath.get(cache, 'modified');
	}

	//search through folder for dependencies
	let mtimes = [];
	let folders = [];
	searchFolders.forEach((searchFolder) => {
		let modules = path.join(cwd, searchFolder);
		if (!fs.existsSync(modules)) { return; }

		let nodes = fs.readdirSync(modules).map((name) => { return { path: searchFolder, name: name } });
		folders = folders.concat(nodes.sort().filter((node) => {
			let stat = fs.statSync(path.join(cwd, node.path, node.name));
			let isDirectory = stat.isDirectory();
			if (isDirectory) {
				try {
					let stat = fs.statSync(path.join(cwd, node.path, node.name, 'package.json'));
					mtimes.push(opath.get(stat, 'mtime'));
				} catch(e) {}
			}
			return isDirectory;
		}));
	});

	//verify cache. hash the additional maps + mtime of packages
	let checksum;
	if (useCache) {
		let cProfile = crc.crc32(JSON.stringify(profile)).toString(16);
		let cAdditonal = crc.crc32(Object.keys(additional).sort().reduce((result, current) => {
			result.push([current, additional[current]].join());
			return result;
		}, []).join()).toString(16);
		let cTimes = crc.crc32(mtimes.join()).toString(16);
		let cHere = crc.crc32(here).toString(16);
		checksum = crc.crc32(cProfile + cAdditonal + cTimes + cHere).toString(16);
		
		if (checksum === modified) {
			return cache.maps;
		}
	}


	//get new maps
	folders.forEach((folder) => {
		let folderPath = path.join(cwd, folder.path, folder.name);
		let packagePath = path.join(folderPath, 'package.json');
		if (fs.existsSync(packagePath)) {
			
			let obj = jsonfile.readFileSync(packagePath);
			if (opath.has(obj, 'parcello.default.namespace')) {
				let namespace = opath.get(obj, 'parcello.default.namespace');
				let isExternal = opath.get(profile, `dependency.external.${namespace}`, false);
				let externalFolder = opath.get(obj, 'parcello.default.external.folder');
				let sourceFolder = opath.get(obj, 'parcello.default.source.folder');
				if (!namespace) { return; }

				let externalPath = path.join(folderPath, externalFolder);
				if (isExternal) {
					packages[`/${namespace}/${sourceFolder}`] = externalPath;
					packages[`/${folder.name}/${sourceFolder}`] = externalPath;
					return;
				}
				packages[`/${namespace}`] = folderPath;
				packages[`/${folder.name}`] = folderPath;
				return;
			}

			packages[`/${folder.name}`] = folderPath;

		}
	});

	let maps = {};
	//it shouldn't matter because of spec, but preserve order
	Object.keys(additional).forEach((key) => {
		maps[key] = additional[key];
		delete packages[key];
	});

	Object.keys(packages).forEach((key) => {
		maps[key] = packages[key];
	});

	//write to cache
	if (useCache) {
		cache = {
			modified: checksum,
			maps: maps,
		};
		jsonfile.writeFile(cacheFile, cache, { spaces: 2 }, () => {});
	}

	return maps;
}
