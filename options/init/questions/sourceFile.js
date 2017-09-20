'use strict';
const help = require('../help');
const error = require('../error');
const answers = require('../answers');
const isValidFileName = require('../validators/file');
const opath = require('object-path');

let question = {
	type: 'input',
	name: 'sourceFile',
	message: 'Source file name: ',
	setup: (cla, question, answers) => {
		let pkg = cla.package;
		if (opath.has(pkg, question.setting)) { question.default = opath.get(pkg, question.setting); }
	},
	default: 'API.js',
	help: 'The file name for the API code inhabiting the namespace. Usually contains an Object or Class with properties and methods that will be exposed.',
	setting: 'parcello.profiles.default.source.file',
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