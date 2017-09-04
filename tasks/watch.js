module.exports = function task_watch(cla) {
	const gulp = require('gulp');
	require('./default')(cla);

	return gulp.task('watch', function() {
		console.log('-> Watching Source')
		gulp.watch('./Source/**/*.js', ['default']);
	});	
}