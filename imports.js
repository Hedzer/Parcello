
import exported from '/Parcello/exported';
import exports from '/Parcello/exports';

function imports(dependency) {
	if (!(typeof dependency === 'string')) { return false; }
	if (!exported.hasOwnProperty(dependency)) { return false; }
	return exported[dependency];
}

export default imports;

exports(imports).as('/Parcello/imports');
