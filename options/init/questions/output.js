'use strict';
const help = require('../help');
const error = require('../error');
const answers = require('../answers');
const isValidFileName = require('../validators/file');
const opath = require('object-path');

let question = {
	type: 'input',
	name: 'output',
	message: 'Build output file name: ',
	setup: (cla, question, answers) => {
		let pkg = cla.package;
		if (opath.has(pkg, question.setting)) { 
			question.default = opath.get(pkg, question.setting);
			return;
		}
		
		question.default = (answers) => {
			let namespace = (!answers.namespace.trim() ? 'output' : answers.namespace);
			return namespace.replace(/[|&;$%@"<>()+,]/g, '-') + '.js';
		};
	},
	help: 'The file name for the project\'s build output.',
	setting: 'parcello.profiles.default.build.file',
	validate: (answer) => {
		let errors = [];
		if (help(question, answer)) { return false; }

		if (!isValidFileName(answer.trim())) {
			errors.push('Must be a valid filename. /^[0-9a-zA-Z.-]+$/');
		}

		if (error(question, answer, errors)) { return false; }

		answers[question.name] = answer;
		return true;
	}
}
module.exports = question;