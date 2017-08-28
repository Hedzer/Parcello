'use strict';

const option = {
	isCommand: false,
	isDefault: false,
	name: "polyfill",
	shorthand: "p",
	description: "includes polyfills",
	parser: (a) => { return a; },
	default: [],
	action: (cla) => {}
}

module.exports = option;