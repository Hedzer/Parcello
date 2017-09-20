'use strict';

const option = {
	isCommand: false,
	isDefault: false,
	name: "profile",
	args: "<name>",
	shorthand: "p",
	description: "sets the build profile",
	parser: (a) => { return a; },
	default: [],
	initiatory: false,
	action: (cla) => {}
}

module.exports = option;