(function () {
	if (typeof define === 'function' && define.amd) {
		//Allow using this built library as an AMD module
		//in another project. That other project will only
		//see this AMD call, not the internal modules in
		//the closure below.
		define([
			// 'physics/CollisionGrid', 
			// 'utils/Tools', 'utils/DualPool', 'utils/DOMTools', 'utils/DebugDraw'
		], factory);
	} else {
		//Browser globals case. Just assign the
		//result to a property on the global.
		root.vonkai = factory();
	}
}(this, function () {