#!/usr/bin/env node

'use strict';

const cli = require('commander');
const expandTilde = require('expand-tilde');
const directory = expandTilde('~/Dropbox/Projects/GitHub/parcello-test/');//process.cwd();
const fs = require('fs');
const getProfile = require('./profile');

//read options
let files = fs.readdirSync('./options');
let options = {};

files.sort((a, b) => {
	let optionA = require(`./options/${a}`);
	let optionB = require(`./options/${b}`);
	if (optionA.isCommand === optionB.isCommand) {
		return (a > b ? 1 : -1);
	}
	if (optionA.isCommand && !optionB.isCommand) { return -1; }
	if (!optionA.isCommand && optionB.isCommand) { return 1; }

});

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
	cli.option(aliases.join(), option.description, option.parser, option.default); 
});

cli.parse(process.argv);

let profile = getProfile(directory, cli.profile, cli);
Object.keys(options).forEach((name) => {
	let args = cli[name];
	if (!(name in cli)) { return; }
	let option = options[name];
	let cla = {
		arguments: args,
		directory: directory,
		profile: profile,
		options: cli, 
	};
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
});
