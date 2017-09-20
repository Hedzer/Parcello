'use strict';
const gulp = require('gulp');

const option = {
	isCommand: true,
	isDefault: false,
	name: "external",
	args: false,
	shorthand: "e",
	description: "builds only external dependency links",
	parser: (a) => { return a; },
	default: [],
	initiatory: false,
	action: (cla) => {
		const task = require('../tasks/external')(cla);
		gulp.start('external');
	}
}

module.exports = option;