define(function(require) {

// constructor
var DualPool = function(classConstructor, instanceSettings, initSize) {
	var obj;
	this._Class = classConstructor;
	this._freeList = new LinkedList();
	this._busyList = new LinkedList();
	this._settings = instanceSettings || {};
	this._settings.pool = this;
	
	this.size = initSize;
	
	for (var i = 0; i < this.size; i++) {
		this._freeList.add(new this._Class(this._settings));
	}
	// console.log();
};


DualPool.prototype = {
	constructor: DualPool,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
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
		return obj;
	},
	
	recycle: function(thing) {
		if (this._busyList.has(thing)) {
			obj = this._busyList.pop();
			this._freeList.add(obj);
		
		} else if (this._freeList.has(thing)) {
			// it's already been recycled
		} else {
			// not in either list? just add it then, whatever
			this._freeList.add(thing);
			this.size++;
		}
	},
	
	freeAll: function() {
		
	},
	
	dispose: function() {
		this._freeList.dispose();
		this._busyList.dispose();
		this._freeList = null;
		this._busyList = null;
		this._Class = null;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE
	-------------------------------------------------------------------------------*/
	
	
	
};

return DualPool;

});