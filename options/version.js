'use strict';

const option = {
	isCommand: false,
	isDefault: false,
	name: "version",
	args: '<n.n.n>',
	shorthand: "v",
	description: "builds a specific version",
	parser: (a) => { return a; },
	default: [],
	initiatory: false,
	action: (cla) => {}
}

module.exports = option;