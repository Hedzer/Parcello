
let exported = {};

const namespace = '/Parcello/exported';
if (!(namespace in window)) {
	Object.defineProperty(window, namespace, {
		configurable:true,
		enumerable:false,
		writable: true,
		value: exported,
	});
}

export default exported;
