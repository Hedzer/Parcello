'use strict';

const option = {
	isCommand: false,
	isDefault: true,
	name: "es6",
	description: "does not transform ES6 to ES5 during the build process",
	parser: (a) => { return a; },
	default: [],
	action: (cla) => {}
}

module.exports = option;