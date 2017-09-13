'use strict';
const gulp = require('gulp');

const option = {
	isCommand: true,
	isDefault: false,
	name: "prod",
	args: false,
	description: "builds the project, minifies, and produces external dependency links",
	parser: (a) => { return a; },
	default: [],
	initiatory: false,
	action: (cla) => {
		const task = require('../tasks/default')(cla);
		gulp.start('default');
	}
}

module.exports = option;