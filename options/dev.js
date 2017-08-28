'use strict';

const option = {
	isCommand: true,
	isDefault: true,
	name: "dev",
	description: "builds the project and produces external dependency links",
	parser: (a) => { return a; },
	default: [],
	action: (cla) => {}
}

module.exports = option;