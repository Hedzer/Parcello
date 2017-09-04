'use strict';
const help = require('../help');
const error = require('../error');
const isValidFileName = require('../validators/file');
const opath = require('object-path');

let question = {
	type: 'input',
	name: 'build',
	message: 'Build folder name: ',
	setup: (cla, question, answers) => {
		let pkg = cla.package;
		if (opath.has(pkg, question.setting)) { 
			question.default = opath.get(pkg, question.setting);
			return;
		}

		question.default = 'build';
	},
	default: 'build',
	help: 'The name of the build folder where build, minified, and polyfilled outputs are sent.',
	setting: 'parcello.default.build.folder',
	validate: (answer) => {
		let errors = [];
		if (help(question, answer)) { return false; }

		if (!isValidFileName(answer.trim())) {
			errors.push('Must be a valid folder name. [0-9a-zA-Z.-]+$');
		}

		if (error(question, answer, errors)) { return false; }

		return true;
	}
}
module.exports = question; 