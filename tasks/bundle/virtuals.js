module.exports = function virtuals(cla) {
	const virtual = require('rollup-plugin-virtual');
	const settings = cla.settings;
	const cache = settings.cache;
	const dev = !cla.options.prod;
	const prod = !dev;
	const version = cache.version;
	const profile = cache.profile;

	const files = {
		'Parcello/environment': 
			`const ENV = {
				dev: ${dev},
				prod: ${prod},
				version: '${version}',
				profile: '${profile}',
			};
			export default ENV;`
	};
	
	let entries = {};
	Object.entries(files).forEach((entry) => {
		let file = entry[0];
		let contents = entry[1];
		entries[file] = contents;
		entries[`/${file}`] = contents;
	});

	return virtual(entries);
}
