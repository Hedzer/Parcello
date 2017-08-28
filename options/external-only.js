'use strict';

const option = {
	isCommand: false,
	isDefault: true,
	name: "external-only",
	shorthand: "eo",
	description: "builds only external dependency links",
	parser: (a) => { return a; },
	default: [],
	action: (cla) => {}
}

module.exports = option;