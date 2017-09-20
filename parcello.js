#!/usr/bin/env node

'use strict';

const cli = require('commander');
const expandTilde = require('expand-tilde');
const here = expandTilde(__dirname);
const directory = expandTilde(process.cwd());
const fs = require('fs')
const path = require('path');
const getProfile = require('./profile');
const jsonfile = require('jsonfile');
const chalk = require('chalk');
const packagePath = path.join(directory, 'package.json');

if (!fs.existsSync(packagePath)) {
	console.log(chalk.bold.red(` package.json is missing from ${directory}\n Please run initialize npm in this directory before continuing.`));
	return;
}

jsonfile.readFile(packagePath, (err, config) => {
	if (err) {
		console.log(chalk.bold.red(`Unable to parse package.json`));
		return;
	}

	//read options
	let files = fs.readdirSync(__dirname + '/options');
	let options = {};

	//sort by commands first, then alpha
	files.sort((a, b) => {
		let optionA = require(`./options/${a}`);
		let optionB = require(`./options/${b}`);
		if (optionA.isCommand === optionB.isCommand) {
			return (a > b ? 1 : -1);
		}
		if (optionA.isCommand && !optionB.isCommand) { return -1; }
		if (!optionA.isCommand && optionB.isCommand) { return 1; }

	});

	//select files, not folders
	files = files.filter(file => fs.statSync(__dirname + `/options/${file}`).isFile());

	//add coptions to menu
	files.forEach((file) => {
		let option = require(`./options/${file}`);
		if (!option || !option.name) { return; }

		options[option.name] = option;
		let aliases = []; 
		if (option.shorthand && !option.isCommand) {
			aliases.push(`-${option.shorthand}`);
		}
		aliases.push((option.isCommand ? '' : '--') + `${option.name}`);
		if (option.isCommand) {
			cli.option(aliases.join(), option.description, { isDefault: option.isDefault });
			return;
		}
		cli.option(aliases.join() + (option.args ? ' ' + option.args : ''), option.description, option.parser, option.default); 
	});

	cli.parse(process.argv);
	let settings = getProfile(directory, config.parcello, cli.profile, cli);
	if (settings === Error) { return; }

	let errors = [];
	function check(name) {

		let args = cli[name];
		if (!(name in cli)) { return; }

		let option = options[name];
		let cla = {
			arguments: args,
			here: here,
			directory: directory,
			settings: settings,
			profile: settings.profile,
			options: cli,
			package: config,
		};

		if (!option.initiatory && !settings) {
			if (name === 'version' && Array.isArray(args) || !option.isCommand) { return; }
			errors.push(option.name);	
			return;
		}
		let result = option.action(cla);
		if (!result) { return; }

		if (result.then) {
			result.then((data) => {
				console.log(data);
			});
		}
		if (result.catch) {
			result.catch((err) => {
				console.log(err);
			});
		}

	}

	let hasExecuted = false;
	let defaultCommand = 'dev';
	Object.keys(options).forEach((name) => {
		let args = cli[name];
		let isFakeVersion = (name === 'version' && Array.isArray(args));
		let hasCommand = (name in cli);
		if (hasCommand && !isFakeVersion) {
			let option = options[name];
			if (option.isDefault) {
				defaultCommand = option.name;
			}
			hasExecuted = (option.isCommand || hasExecuted);
			check(name);
		}
	});

	if (!hasExecuted) {
		cli[defaultCommand] = true;
		check(defaultCommand);
	}

	let ecount = errors.length;
	if (ecount) {
		let s = (ecount > 1 ? 's' : '');
		let ns = (ecount > 1 ? '' : 's');
		console.log(chalk.bold.red(' ERROR: '));
		console.log(chalk.bold.red(' ' + errors.join(', ') + ` command${s} require${ns} that the current working directory be initialized.`));
	}

});
