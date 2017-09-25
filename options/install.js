'use strict';
const gulp = require('gulp');

const option = {
	isCommand: true,
	isDefault: false,
	name: "install",
	args: false,
	shorthand: "i",
	description: "installs all dependencies",
	parser: (a) => { return a; },
	default: [],
	initiatory: true,
	action: (cla) => {
		const task = require('../tasks/install')(cla);
		gulp.start('install');
	}
}

module.exports = option;