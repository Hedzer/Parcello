'use strict';

const option = {
	isCommand: false,
	isDefault: false,
	name: "version",
	shorthand: "v",
	description: "builds a specific version",
	parser: (a) => { return a; },
	default: [],
	action: (cla) => {}
}

module.exports = option;