'use strict';
const help = require('../help');
const error = require('../error');
const answers = require('../answers');
const isValidNamespace = require('../validators/namespace');
const opath = require('object-path');

let question = {
	type: 'input',
	name: 'namespace',
	message: 'Project namespace: ',
	help: 'Every project needs a root namespace, a way to interact with it\'s API. For example, if you chose "Earth" as a namespace, and have a method exposed called "spins", your syntax to call "spins" would be Earth.spins()',
	setting: 'parcello.default.namespace',
	setup: (cla, question, answers) => {
		let pkg = cla.package;
		if (opath.has(pkg, question.setting)) {
			question.default = opath.get(pkg, question.setting);
			return;
		}

		let folder = cla.directory.match(/([^\/]*)\/*$/)[1];
		question.default = (question.default || folder).replace(/^[^a-zA-Z_]+|[^a-zA-Z_0-9]+/, '').trim();
	},
	validate: (answer) => {
		let errors = [];
		if (help(question, answer)) { return false; }
		
		if (!isValidNamespace(answer.trim())) {
			errors.push('Must be a valid namespace, and cannot be a reserved word. /^[$A-Z_][0-9A-Z_$]*$/i');
		}

		if (error(question, answer, errors)) { return false; }

		return true;
	}
}
module.exports = question; 