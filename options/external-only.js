'use strict';

const option = {
	isCommand: false,
	isDefault: true,
	name: "external-only",
	args: false,
	shorthand: "eo",
	description: "builds only external dependency links",
	parser: (a) => { return a; },
	default: [],
	initiatory: false,
	action: (cla) => {}
}

module.exports = option;