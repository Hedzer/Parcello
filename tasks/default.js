module.exports = function default_build(cla) {
	const gulp = require('gulp');

	require('./dev')(cla);
	require('./production')(cla);
	require('./external')(cla);

	return gulp.task('default', function() {
		if (cla.options['external-only']) {
			return gulp.start('external');
		}
		if (cla.options.production) {
			return gulp.start('production');
		}
		return gulp.start('dev');
	});
}