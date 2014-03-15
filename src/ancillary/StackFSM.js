define(function(require) {
	
// imports
// var Kai = require('core/Kai');

/*
	Stack-based Finite State Machine.
*/
var StackFSM = function() {
	
	this.stack = [];
	
	this._activeFunction = null;
};


StackFSM.prototype = {
	constructor: StackFSM,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	// don't forget to bind the passed function
	pushState: function(state) {
		if (state !== this._activeFunction) {
			this.stack.push(state);
		}
	},
	
	popState: function() {
		return this.stack.pop();
	},
	
	update: function() {
		this._activeFunction = this.stack.length ? this.stack[this.stack.length - 1] : null;
		if (this._activeFunction) {
			this._activeFunction();
		}
	},
	
	dispose: function() {
		this.stack = null;
		this._activeFunction = null;
	}
	
};

return StackFSM;

});