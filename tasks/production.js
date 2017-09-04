module.exports = function task_prduction(cla) {
	const gulp = require('gulp');
	const runSequence = require('run-sequence');

	require('./bundle')(cla);
	require('./minify')(cla);
	require('./external')(cla);

	return gulp.task('production', function(){
		runSequence([cla.options.es6 ? 'bundle-es6' : 'bundle'], ['minify'], 'external');
	});
}