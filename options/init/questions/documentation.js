'use strict';
const help = require('../help');
const error = require('../error');
const isValidFileName = require('../validators/file');
const capitalize = require('capitalize');
const opath = require('object-path');

let question = {
	type: 'input',
	name: 'documentation',
	message: 'Documentation folder name: ',
	setup: (cla, question, answers) => {
		let pkg = cla.package;
		if (opath.has(pkg, question.setting)) { 
			question.default = opath.get(pkg, question.setting);
			return;
		}
		
		question.default = (answers) => {
			let namespace = answers.namespace;
			if (capitalize(namespace) === namespace) {
				return 'Documentation';
			}
			return 'documentation';
		};
	},
	default: 'Documentation',
	help: 'The name of the documentation folder where all test driven documentation is stored. Test driven documentation defines a specification in a way that can be tested to assure that documentation does not stray from functionality.',
	setting: 'parcello.default.documentation.folder',
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