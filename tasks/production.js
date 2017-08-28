const gulp = require('gulp');
const runSequence = require('run-sequence');
const util = require('gulp-util');


require('./bundle')(cla);
require('./minify')(cla);
require('./external')(cla);

module.exports = gulp.task('production', function(){
	runSequence([cla.options.es6 ? 'bundle-es6' : 'bundle'], ['minify'], 'external');
});