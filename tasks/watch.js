const gulp = require('gulp');

module.exports = gulp.task('watch', function() {
	console.log('-> Watching Source')
	gulp.watch('./Source/**/*.js', ['default']);
});