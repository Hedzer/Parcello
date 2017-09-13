'use strict';
const help = require('../help');
const error = require('../error');
const isValidFileName = require('../validators/file');
const capitalize = require('capitalize');
const opath = require('object-path');

let question = {
	type: 'input',
	name: 'source',
	message: 'Source folder name: ',
	setup: (cla, question, answers) => {
		let pkg = cla.package;
		if (opath.has(pkg, question.setting)) { 
			question.default = opath.get(pkg, question.setting);
			return;
		}
		
		question.default = (answers) => {
			let namespace = answers.namespace;
			if (capitalize(namespace) === namespace) {
				return 'Source';
			}
			return 'source';
		};
	},
	default: 'Source',
	help: 'The name of the source folder that houses the different versions of your source code.',
	setting: 'parcello.default.source.folder',
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