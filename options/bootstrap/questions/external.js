'use strict';
const help = require('../help');
const error = require('../error');
const isValidFileName = require('../validators/file');
const capitalize = require('capitalize');
const opath = require('object-path');

let question = {
	type: 'input',
	name: 'external',
	message: 'External folder name: ',
	setup: (cla, question, answers) => {
		let pkg = cla.package;
		if (opath.has(pkg, question.setting)) { 
			question.default = opath.get(pkg, question.setting);
			return;
		}
		
		question.default = (answers) => {
			let namespace = answers.namespace;
			if (capitalize(namespace) === namespace) {
				return 'External';
			}
			return 'external';
		};
	},
	default: 'External',
	help: 'The name of the external folder where all dependency links are housed. External dependency links are used when one project depends on another project, but doesn\'t want to include the source in it\'s own final build.  External dependency links allow you to produce a build that has only your project\'s files bundled into the final output. External dependency links can also be selectively rolled into a build.',
	setting: 'parcello.default.external.folder',
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