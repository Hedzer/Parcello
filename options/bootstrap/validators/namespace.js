
const reserved = {
	'abstract':true,
	'boolean':true,
	'with':true,
	'abstract': true,
	'arguments': true,
	'await': true,
	'boolean': true,
	'break': true,
	'byte': true,
	'case': true,
	'catch': true,
	'char': true,
	'class': true,
	'const': true,
	'continue': true,
	'debugger': true,
	'default': true,
	'delete': true,
	'do': true,
	'double': true,
	'else': true,
	'enum': true,
	'eval': true,
	'export': true,
	'extends': true,
	'false': true,
	'final': true,
	'finally': true,
	'float': true,
	'for': true,
	'function': true,
	'goto': true,
	'if': true,
	'implements': true,
	'import': true,
	'in': true,
	'instanceof': true,
	'int': true,
	'interface': true,
	'let': true,
	'long': true,
	'native': true,
	'new': true,
	'null': true,
	'package': true,
	'private': true,
	'protected': true,
	'public': true,
	'return': true,
	'short': true,
	'static': true,
	'super': true,
	'switch': true,
	'synchronized': true,
	'this': true,
	'throw': true,
	'throws': true,
	'transient': true,
	'true': true,
	'try': true,
	'typeof': true,
	'var': true,
	'void': true,
	'volatile': true,
	'while': true,
	'with': true,
	'yield': true,
};

module.exports = function isValidNamespace(namespace) {
	return (/^[$A-Z_][0-9A-Z_$]*$/i.test(namespace) && !reserved[namespace]);
}