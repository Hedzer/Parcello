'use strict';

module.exports = function task_init(cla) {
	const gulp = require('gulp');
	const fs = require('fs-extra');
	const path = require('path');
	const opath = require('object-path');
	const jsonfile = require('jsonfile');

	return gulp.task('init', function() {
		let answers = cla.answers;
		let cwd = cla.directory;

		// create folders
		let folders = [
			answers.source,
			answers.documentation,
			answers.tests,
			answers.external,
			answers.build,
		];

		folders.forEach((folder) => {
			let dir = path.join(cwd, folder, answers.version);
			if (!fs.existsSync(dir)){
				fs.ensureDirSync(dir);
			}
		});

		//create dependency folder
		(() => {
			let dir = path.join(cwd, answers.dependency);
			if (!fs.existsSync(dir)){
				fs.ensureDirSync(dir);
			}
		})();

		//if package.json->parcello doesn't exist, create it
		if (!cla.package.parcello) {
			let template = require('../templates/parcello.json');
			cla.package.parcello = template;
		}
		
		//populate with settings
		//console.log(cla.questions);
		cla.questions.forEach((question) => {
			if (!question.setting) { return; }
			opath.set(cla.package, question.setting, answers[question.name]);
		});

		//remove cache
		opath.del(cla.package, 'parcello.cache');

		//write package.json back
		let packagejson = path.join(cwd, 'package.json');
		jsonfile.writeFile(packagejson, cla.package, {spaces: 2}, function(err, result) {
			if (err) {
				console.log(chalk.bold.red(' ERROR: '));
				console.log(chalk.bold.red(' Unable to write to package.json'));
				return;
			}
		});

		//copy & rename API
		let destination = path.join(cwd, answers.source, answers.sourceFile);
		if (!fs.existsSync(destination)) {	
			fs.copy('../templates/API.js', destination).catch(() => {
				console.log(chalk.bold.red(' ERROR: '));
				console.log(chalk.bold.red(' Unable to copy API template to ' + destination));
			});
		}

	});	
}
