module.exports = function task_install(cla) {
	const path = require('path');
	const fs = require('fs-extra');
	const gulp = require('gulp');
	const install = require("gulp-install");
	const opath = require('object-path');
	const git = require('simple-git/promise');
	const chalk = require('chalk');
	const inquirer = require('inquirer');
	const URL = require('url-parse');
	const settings = cla.settings;
	const profile = cla.profile;
	const config = cla.settings.config;
	const directory = cla.directory;
	//needs to be rewritten
	let installs = opath.get(profile, 'dependency.install', {});
	let dependencies = opath.get(config, 'folders.dependency', false);
	let repos = opath.get(profile, 'dependency.repos', {});
	let hasRepos = !!Object.keys(repos).length;
	if (installs.git && hasRepos && !dependencies) {
		console.log(chalk.bold.red('Aborting install, missing dependency folder used for git cloning.'));
		return;
	}

	let configs = {
		npm: 'package.json',
		bower: 'bower.json',
		tsd: 'tsd.json',	
		typings: 'typings.json',
		composer: 'composer.json',
		pip: 'requirements.txt',
	};

	let files = [];
	Object.entries(configs).forEach((entry) => {
		let file = entry[1];
		let manager = entry[0];
		let location = path.join(directory, file);
		if (fs.existsSync(location) && installs[manager]) {
			files.push(location);
		}
	});
	
	return gulp.task('install', function() {
		//clone git repos
		if (installs.git) {
			let names = Object.keys(repos);
			let hasPrivateRepos = Object.values(repos).reduce((acc, value) => {
				return (acc || value.private);
			}, false);
			
			function getRepos(credentials) {
				names.forEach((name) => {
					let repo = repos[name];
					let url = new URL(repo.remote);
					let remote = repo.remote;
					let original = remote;
					let hostname = url.hostname;
					if (credentials && credentials.username && credentials.password) {
						url.set('username', credentials.username);
						url.set('password', credentials.password);
						remote = url.toString();
					}
					let folder = path.join(directory, dependencies, name);
					if (fs.existsSync(folder)) { fs.removeSync(folder);	}
					git().clone(remote, folder)
					.then((d) => {
						console.log(chalk.bold.green(`Successfully cloned: ${original} to ${name}`));
					})
					.catch((e) => {
						console.log(chalk.bold.red(`Failed to clone: ${original} to ${name}`));
						console.log(chalk.bold.red(String(e)));
					});
				});

				//strip out bools
				Object.keys(settings).forEach((k) => {
					if (typeof settings[k] === 'boolean') { delete settings[k]; } 
				});
				return gulp.src(files).pipe(install(settings));
			}

			if (hasPrivateRepos) {
				console.log('Some of the git repos are marked as private, requiring authentication.');
				return inquirer.prompt([
					{
						name: 'username',
						message: 'username:',
						validate: (value) => {
							return !!value;
						},
					},
					{
						name: 'password',
						type: 'password',
						message: 'password:',
						validate: (value) => {
							return !!value;
						},
					}
				]).then(getRepos);
			}

			return getRepos();

		}

	});	
}