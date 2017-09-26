
const namespace = '/Parcello/exported';

let exported = window[namespace];
if (!(namespace in window)) {
	exported = {};
	Object.defineProperty(window, namespace, {
		configurable:true,
		enumerable:false,
		writable: true,
		value: exported,
	});
}

export default exported;
