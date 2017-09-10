'use strict';
module.exports = function task_external(cla) {
	const gulp = require('gulp');
	const path = require('path');
	const fs = require('fs');
	const getFiles = require('recursive-readdir');
	const fsExtra = require('fs-extra');
	const profile = cla.profile;

	let lists = {};
	['ignore', 'copy'].forEach((key) => {
		let result = {};
		lists[key] = result;
		let list = profile.external[key];

		if (!('external' in profile)) { return; }
		if (!Array.isArray(list)) { return; }
		
		list.forEach((item) => {
			if (typeof item !== 'string') { return; }
			result[item] = true;
		});
	});

	function externalize(dependency) {
		let extension = path.extname(dependency);
		extension = (typeof extension === 'string' ? extension : '');
		dependency = dependency.substring(0, dependency.length - extension.length)
		let code = [
			`\nimport imports from '/Parcello/imports';\n`,
			`\nlet imported = imports('${dependency}');\n`,
			`\nexport default imported;\n`
		].join('');
		return code;
	}

	return gulp.task('external', function(callback) {
		let dir = cla.directory;
		let outside = path.join(dir, '../');
		let source = path.join(dir, profile.source.folder);
		let destination = path.join(dir, profile.external.folder);
		if (destination !== dir) {
			fsExtra.emptydirSync(destination);
		}
		let cache = {};
		getFiles(source, function(err, files) {
			files = files || [];
			files.forEach((file) => {
				let dependency = '/' + file.replace(outside, '');
				file = file.replace(source, '');
				let sourceFile = path.join(source, file);
				let destFile = path.join(destination, file);
				let destDir = path.dirname(destFile);
				if (lists.ignore[dependency]) { return; }
				if (!cache[destDir]) {
					fsExtra.mkdirsSync(destDir);
					cache[destDir] = true;
				}
				if (lists.copy[dependency]) {
					fsExtra.copySync(sourceFile, destFile);
					return;
				}
				fs.writeFile(destFile, externalize(dependency));
			});
		});
	});
}