'use strict';

const option = {
	isCommand: false,
	isDefault: false,
	name: "polyfill",
	args: false,
	shorthand: "p",
	description: "includes polyfills",
	parser: (a) => { return a; },
	default: [],
	initiatory: false,
	action: (cla) => {}
}

module.exports = option;