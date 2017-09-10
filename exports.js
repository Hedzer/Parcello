
import exported from '/Parcello/exported';

export default function exports(code) {
	if (arguments.length < 1) { return false; }
	return {
		as: (name) => {
			if (!(typeof name === 'string')) { return false; }
			if (exported.hasOwnProperty(name)) {
				//throw warning
				return false;
			}
			exported[name] = code;
			return true;
		}
	};
}

exports(exports).as('/Parcello/exports');
exports(exported).as('/Parcello/exported');
