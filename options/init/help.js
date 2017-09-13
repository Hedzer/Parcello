'use strict';

const chalk = require('chalk');
const linewrap = require('linewrap');
const wrap = linewrap(85, {lineBreak: '\n  ', mode: 'soft'});

module.exports = function help(question, answer) {
	if (answer === '--?') {
		let response = question.help + '\n' + (question.setting ? '\n  Settings exists within: ' + question.setting : '') + '\n\n';
		console.log('\n');
		console.log(chalk.bold.yellow('\n\n  HELP: ' + question.message.replace(':','')));
		console.log(chalk.yellowBright('  ' + wrap(response)));
		console.log('\n');
		return true;
	}
	return false;
}