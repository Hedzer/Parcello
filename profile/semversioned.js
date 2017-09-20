'use strict';

const toSemver = require('to-semver');
const clone = require('clone');
const opath = require('object-path');
const semverbs = require('semverbs');
const copy = require('defaults-deep');

module.exports = function semversioned(config, profile, version) {
	if (Array.isArray(profile)) { profile = 'default'; }
	profile = (profile || version);
	if (!config) { return false; }
	let profiles = opath.get(config, 'profiles', {});
	let list = toSemver(Object.keys(profiles));
	let defaults = clone(opath.get(profiles, 'default', {}));
	let isSemver = !!toSemver([version]).length;

	//return if the version is not a semantic version
	if (!isSemver) {
		let profile = (opath.has(profiles, version) ? version : 'default');
		return {
			using: profile,
			profile: opath.get(profiles, profile, defaults),
			config: config
		};
	}

	//return defaults if there are no versioned profiles
	let fallback = {
		using: 'default',
		profile: defaults,
		config: config
	};

	if (!list.length) { return fallback; }

	//select and inherit semantic version profiles
	list = list.filter((p) => { return (semverbs.eq(profile, p) || semverbs.gt(profile, p)) });
	if (!list.length) { return fallback; }

	let inherited = list.reduce((acc, profile) => {
		return copy(acc, profiles[profile]);
	}, defaults);


	return {
		using: list[0],
		profile: inherited,
		config: config
	};
}
