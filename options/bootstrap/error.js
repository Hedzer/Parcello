'use strict';

const chalk = require('chalk');
const linewrap = require('linewrap');
const wrap = linewrap(85, {lineBreak: '\n  ', mode: 'soft'})

module.exports = function error(question, answer, errors) {
	if (!errors.length) { return false; } 
	let response = errors.join('\n') + '\n';
	console.log(chalk.bold.red('\n\n  ERROR:'));
	console.log(chalk.red(' ', wrap(response, '\n')));
	console.log('\n');
	return true;
}
