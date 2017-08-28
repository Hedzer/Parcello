module.exports = function dev_build(cla) {
	const gulp = require('gulp');
	const runSequence = require('run-sequence');

	require('./bundle')(cla);
	require('./bundle-es6')(cla);
	require('./external')(cla);

	return gulp.task('dev', function() {
		runSequence([cla.options.es6 ? 'bundle-es6' : 'bundle', 'external']);
	});
}