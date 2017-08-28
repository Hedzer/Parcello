'use strict';

const option = {
	isCommand: true,
	isDefault: false,
	name: "prod",
	description: "builds the project, minifies, and produces external dependency links",
	parser: (a) => { return a; },
	default: [],
	action: (cla) => {}
}

module.exports = option;