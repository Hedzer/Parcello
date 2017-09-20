'use strict';
const help = require('../help');
const error = require('../error');
const isValidFileName = require('../validators/file');
const capitalize = require('capitalize');
const opath = require('object-path');

let question = {
	type: 'input',
	name: 'dependency',
	message: 'Dependencies folder name: ',
	setup: (cla, question, answers) => {
		let pkg = cla.package;
		if (opath.has(pkg, question.setting)) { 
			question.default = opath.get(pkg, question.setting);
			return;
		}
		
		question.default = (answers) => {
			let namespace = answers.namespace;
			if (capitalize(namespace) === namespace) {
				return 'Dependencies';
			}
			return 'dependencies';
		};
	},
	default: 'Dependencies',
	help: 'The name of the dependency folder where dependencies other than node_modules will be stored. Repositories will be downloaded to this directory automatically. "import X from Y" statements will automatically link to content in this folder, as well as node_modules.',
	setting: 'parcello.folders.dependency',
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