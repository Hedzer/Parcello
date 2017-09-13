'use strict';
const gulp = require('gulp');
const inquirer = require('inquirer');
const answers = require('./init/answers');
const chalk = require('chalk');

//questions
const namespace = require('./init/questions/namespace');
const source = require('./init/questions/source');
const version = require('./init/questions/version');
const sourceFile = require('./init/questions/sourceFile');
const dependency = require('./init/questions/dependency');
const build = require('./init/questions/build');
const output = require('./init/questions/output');
const external = require('./init/questions/external');
const documentation = require('./init/questions/documentation');
const test = require('./init/questions/test');

const option = {
	isCommand: true,
	isDefault: false,
	name: "init",
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
			const task = require('../tasks/init')(cla);
			gulp.start('init');
		});


	}
}

module.exports = option;