'use strict';
const help = require('../help');
const error = require('../error');
const isValidFileName = require('../validators/file');
const capitalize = require('capitalize');
const opath = require('object-path');

let question = {
	type: 'input',
	name: 'tests',
	message: 'Test folder name: ',
	setup: (cla, question, answers) => {
		let pkg = cla.package;
		if (opath.has(pkg, question.setting)) { 
			question.default = opath.get(pkg, question.setting);
			return;
		}
		
		question.default = (answers) => {
			let namespace = answers.namespace;
			if (capitalize(namespace) === namespace) {
				return 'Tests';
			}
			return 'tests';
		};
	},
	default: 'Tests',
	help: 'The name of the folder that houses your project\'s tests.',
	setting: 'parcello.folders.tests',
	validate: (answer) => {
		let errors = [];
		if (help(question, answer)) { return false; }

		if (!isValidFileName(answer.trim())) {
			errors.push('Must be a valid folder name. /^[0-9a-zA-Z.-]+$/');
		}

		if (error(question, answer, errors)) { return false; }

		return true;
	}
}
module.exports = question; 