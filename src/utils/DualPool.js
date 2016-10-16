/*
	A fast (LinkedList-based), minimal object pooling system.
	Uses two lists to maintain used and unused objects, and expands dynamically.

	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
mh.DualPool = function(classConstructor, instanceSettings, initSize) {
	this._Class = classConstructor;
	this._freeList = new mh.LinkedList();
	this._busyList = new mh.LinkedList();
	this._settings = instanceSettings || {};
	this._settings.pool = this;

	this.size = initSize;

	for (var i = 0; i < this.size; i++) {
		this._freeList.add(new this._Class(this._settings));
	}
};

mh.DualPool.prototype = {
	constructor: mh.DualPool,

	get: function() {
		var obj;
		if (this._freeList.length) {
			obj = this._freeList.pop();
			this._busyList.add(obj);
			return obj;
		}

		// grow
		obj = new this._Class(this._settings);
		this._busyList.add(obj);
		this.size++;
		// console.log('[DualPool.get] Free: '+this._freeList.length+'; Busy: '+this._busyList.length);

		return obj;
	},

	recycle: function(obj) {
		if (this._busyList.has(obj)) {
			this._busyList.remove(obj);
			this._freeList.add(obj);

		} /*else {
			// already in free, or not in either list
			console.log('[DualPool.recycle] Object ignored');
		}*/
		// console.log('[DualPool.recycle] Free: '+this._freeList.length+'; Busy: '+this._busyList.length);
	},

	freeAll: function() {
		var obj, node = this._busyList.first;
		while (node) {
			obj = node.obj;
			this._busyList.remove(obj);
			this._freeList.add(obj);
			node = node.next;
		}
	},

	dispose: function() {
		this._freeList.dispose();
		this._busyList.dispose();
		this._freeList = null;
		this._busyList = null;
		this._Class = null;
		this._settings = null;
	},

	toString: function() {
		return '[DualPool size: '+this.size+', free: '+this._freeList.length+', busy: '+this._busyList.length+']';
	}
};
