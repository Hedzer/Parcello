'use strict';

const option = {
	isCommand: false,
	isDefault: true,
	name: "es6",
	args: false,
	description: "does not transform ES6 to ES5 during the build process",
	parser: (a) => { return a; },
	default: [],
	initiatory: false,
	action: (cla) => {}
}

module.exports = option;