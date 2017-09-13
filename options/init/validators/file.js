module.exports = function isValidFileName(filename) {
	return /^[0-9a-zA-Z.-]+$/.test(filename);
}