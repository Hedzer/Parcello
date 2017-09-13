'use strict';
const gulp = require('gulp');
const inquirer = require('inquirer');
const answers = require('./bootstrap/answers');
const chalk = require('chalk');

//questions
const namespace = require('./bootstrap/questions/namespace');
const source = require('./bootstrap/questions/source');
const version = require('./bootstrap/questions/version');
const sourceFile = require('./bootstrap/questions/sourceFile');
const dependency = require('./bootstrap/questions/dependency');
const build = require('./bootstrap/questions/build');
const output = require('./bootstrap/questions/output');
const external = require('./bootstrap/questions/external');
const documentation = require('./bootstrap/questions/documentation');
const test = require('./bootstrap/questions/test');

const option = {
	isCommand: true,
	isDefault: false,
	name: "bootstrap",
	args: false,
	description: "sets up a new parcello project",
	parser: (a) => { return a; },
	default: [],
	initiatory: true,
	action: (cla) => {
		let questions = [
			namespace,
			source,
			version,
			sourceFile,
			dependency,
			build,
			output,
			external,
			documentation,
			test,
		];
		cla.questions = questions;

		//fill in previous as defaults
		questions.forEach((q) => {
			q.default = answers[q.name] || q.default;
			if (typeof q.setup === 'function') { q.setup(cla, q, answers); }
		});

		console.log(chalk.bold.yellow('\n  You may get help regarding any question by typing --? in the prompt\n'));
		inquirer.prompt(questions).then(function (answers) {
		    cla.answers = answers;
			const task = require('../tasks/bootstrap')(cla);
			gulp.start('bootstrap');
		});


	}
}

module.exports = option;