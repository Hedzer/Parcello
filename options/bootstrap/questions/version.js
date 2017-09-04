'use strict';
const help = require('../help');
const error = require('../error');
const answers = require('../answers');
const semverRegex = require('semver-regex');
const isValidFileName = require('../validators/file');
const opath = require('object-path');

let question = {
	type: 'input',
	name: 'version',
	message: 'Initial version: ',
	default: '1.0.0',
	help: 'The version used to create the folders inside of the Source folder. Must be a valid semantic version. e.g. 1.0.0 . This will create the following structure: /[project folder]/[source folder name]/[version].',
	validate: (answer) => {
		let errors = [];
		if (help(question, answer)) { return false; }

		if (!semverRegex().test(answer)) {
			errors.push('Must be a valid semantic version. e.g. 1.0.0 or v1.0.0');
		}

		if (!isValidFileName(answer.trim())) {
			errors.push('Must be a valid folder name. /^[0-9a-zA-Z.-]+$/');
		}
		
		if (error(question, answer, errors)) { return false; }

		answers[question.name] = answer;
		return true;
	}
}
module.exports = question; 