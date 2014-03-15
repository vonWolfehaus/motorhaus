define(function(require) {
	
// imports
// var Kai = require('core/Kai');
var Tools = require('utils/Tools');

/*
	Stack-based Finite State Machine.
*/
var StackFSM = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// public properties
	this.stack = [];
	
	// attribute override
	Tools.merge(this, settings);
	
	// other properties
	this.entity = entity;
	
	// private
	this._activeFunction = null;
};

// required statics for component system
StackFSM.accessor = 'stackFSM'; // property name as it sits on an entity
StackFSM.className = 'STACK_FSM'; // name of component on the component definition object
StackFSM.priority = 10; // general position in the engine's component array; the lower, the earlier it's updated
StackFSM.post = false; // whether or not this component will have a postUpdate() called on it


StackFSM.prototype = {
	constructor: StackFSM,
	
	activate: function() {
		this.active = true;
	},
	
	disable: function() {
		this.active = false;
	},
	
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
	}
};

return StackFSM;

});