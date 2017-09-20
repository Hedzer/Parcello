# Parcello

Parcello is a build tool for ES6 projects. It uses gulp, babel, rollup and some custom plugins to build code and manage dependencies. 

### Disclaimer
Parcello was originally built to organize my own projects. It's still a work in progress and very much a minimum viable product created to avoid copy/pasting build code between projects.

### Installing
```sh
npm install parcello -g
```
### Using
####
```sh
parcello --help
```
Provides a list of commands and options available, along with brief descriptions of the available functionality.
```sh
parcello init
```
Initializes a project by creating folders, copying over templates, and adding configuration information to the current working directory package.json. `init` will ask a series of questions with best-guess defaults. If you're unsure about any question, you can type `--?` during the prompt of the qestion for more information.
```sh
parcello dev
```
Builds only source, source maps, and external dependency links. Does not minify the build output or produce polyfills.
```sh
parcello prod
```
Builds source, source maps, external dependency links, minifies the output and produces polyfills.

Both `parcello prod` and `parcello dev` can be used with the following switches:
* `--version, -v <n.n.n>` builds a specific version of the project. 
usage: `parcello dev --version 1.0.1`

* ` --profile, -p` sets the build profile to use during the current build. The build profile is defined in the `parcello` key within the project's `package.json`. the config section below contains more details on these configurations.

* `--es6`     does not transform ES6 to ES5 during the build process
usage: ` parcello dev --es6 `

```sh
parcello doc
```
Builds doc files and produces an HTML doc output. TBA/Unimplemented.
```sh
parcello test
```
Builds test files and runs tests. TBA/Unimplemented.

#### Configuring
Configuration is mostly handled with the `parcello init` command and questions.  More detailed configuration can be achieved by editing `package.json`. After `parcello init`, the NPM config file should contain a `parcello` key. Config details are as follows:

```js
{
    // the namespace for the project. 
    // used for dependencies and API exposure.
    "namespace": "Example",
    // name of the profile
	"folders": {
		// folder housing all source
		"source": "source",
		// the name of the output folder for a build
		//actual output will be inside /build/version
		"build": "build",
	    // any dependency not within node_modules
	    // the folder where repos will be cloned into
		"dependency": "dependencies",
		// name of the output folder for external dependency links
		"external": "external",
		// folder housing all tests
		"tests": "tests",
		// folder housing all documentation
		"documentation": "documentation"
	},
	"default": {  
		// extensions to search for during the build process
		"extensions": [
			"js"
		],
		// source settings
		"source": {
		    // API/entry file that deep links to the rest of the source
			"file": "",
			// append external dependency link code
			"auto-externalize": true
		},
	    // build settings
		"build": {
		    // the name of the output file for a build
		    // maps will be example.js.map, min will be example.min.js
			"file": "example.js"
		},
		//dependency settings
		"dependency": {
			// repos that will be cloned on install
			"repos": {
			   //folder name where remote will be cloned to
              "JSUI": {
                // git repo url
                "remote": "https://github.com/Hedzer/JSUI",
                // does it require authentication?
                "private": true,
                // the state of the repo to checkout
                "checkout": "313ab334bb4..."
              }
			},
			// sources to remap
			// remapped sources can point any dependency A to B
			"remap": {
			    // import X from '/Project/A/trim';
			    // now acts like:
			    // import X from '/Example/B/trim';
			    "/Project/A": "/Example/B"
			},
			// dependency search settings
			"search": {
			    // should a search be conducted?
				"active": true,
				// should search results be cached?
				"cache": true,
				// what folders should be searched
				// these are in order of priority 
				"folders": [
					"node_modules"
				]
			},
			// external dependency settings
			"external": {
			    // JSUI will no longer be built with this project
			    // External dependency links will be used instead
			    "JSUI": true
			}
		},
		// external dependency link settings
		"external": {
			// files to ignore when creating external dependency links
			"ignore": [],
			// files to copy instead of link
			"copy": []
		},
		// test settings
		"tests": {},
		// documentation settings
		"documentation": {}
	},
	// profile to use for version 1.0.1, inherits default
	"1.0.1": {},
	// profile to use for version 1.0.2, inherits profile+1.0.1
	"1.0.2": {},
	// another profile, selectable with --profile P64, inherits default
	"P64": {}
}
```

### Concepts
##### External Dependency Links
There are cases where, when building a project, we wouldn't want to roll all the dependencies into the final build. Some dependencies are imported through other means. If the `Lambosta` library was a dependency of the current build, but was loaded as a standalone library, we wouldn't want to build another copy into the current project on top of loading it externally. This might look something like this in the browser:
```html
    <script type="text/javascript" src="Lambosta.js"></script>
    <script type="text/javascript" src="MyProject.js"></script>
```
Now, if we don't link `Lambosta` as external, we'll have two copies. One imported through the `<script>` tag and another rolled into `MyProject.js`. To avoid this external dependency links exist. The build process automatically generates external links. To use them source code must have the following.
Let's assume we have a file, 
```js 
// file: /Lambosta/source/1.0.0/util/capitalize.js
import exports from '/Parcello/exports';

export default function capitalize(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
};

exports(capitalize).as('/Lambosta/source/1.0.0/util/capitalize');

```
an automatically generated external dependency link for the above file would look like the following:
```js
// file: /Lambosta/external/1.0.0/util/capitalize.js
import imports from '/Parcello/imports';

let imported = imports('/Lambosta/source/1.0.0/util/capitalize');

export default imported;

```
usage in `MyProject` would be normal.
```js
import capitalize from '/Lambosta/source/1.0.0/util/capitalize';

export default function boop(snoot) {
	console.log('The following snoot has been booped: ', capitalize(snoot));
};
```
if `Lambosta` is set as an external dependecy, the build will include  `/Lambosta/external/1.0.0/util/capitalize.js` instead of the actual file. This also means that in order for these links to work, source code requires the following lines to exist:
```js 
// file: /Lambosta/source/1.0.0/util/capitalize.js
import exports from '/Parcello/exports';
// source
// export default module;
exports(module).as('/Path/of/source');
```
without exporting using the `/Parcello/exports` module the external link ceases to work. The author of the library being consumed has to have made the code ready to be used as an external dependency link. 

### Behaviors
##### default command
Using `parcello` alone in the command line results in the same command as `parcello dev` with the latest version selected. ES6 is transformed to ES5. default profile is selected unless one matching the semantic version exists. 

#### automatic profile selection
If no profile is selected, a default will be chosen. If there is a profile with the same name as the selected source version, it will be used. If the source version is a semantic version, it will inherit from previous profiles with semantic version names. If these searches fail, `default` will be used.
e.g. If source version `Raspberry` is chosen, and there exists a profile called `Raspberry`, then that profile will be chosen. If there is no identically named profile, `default` will be chosen.

##### version selection
If no version is selected, the latest valid semantic version is the default.

##### semantic version profiles
Each semantic version profile inherits from the previous one, and the first one inherits from default.

### Incomplete
##### auto source externalizing
Controlled by `profile.source.auto-externalize = true/false`. This setting injects the following into the source. It has not yet been safely implemented.
```js 
import exports from '/Parcello/exports';
exports(module).as('/Path/of/source');
```

##### default testing framework
None is selected so far, and no build process has been established yet.

##### documentation framework
Is still on the process of being built.

##### git integration
Cloning & checking out git repos is still unavailable.