module.exports = function task_watch(cla) {
	const gulp = require('gulp');
	require('./default')(cla);
	const profile = cla.profile;
	const config = cla.settings.config;
	//needs to be rewritten
	return gulp.task('watch', function() {
		console.log('-> Watching Source')
		gulp.watch('./Source/**/*.js', ['default']);
	});	
}