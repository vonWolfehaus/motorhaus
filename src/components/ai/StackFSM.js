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
	
	
	// attribute override
	Tools.merge(this, settings);
	
	// other properties
	this.stack = [];
	this.entity = entity;
	
	this.stateChanged = new Signal();
	
	// private
	this._activeContext = null;
	this._activeFunction = null;
	this._prevFunction = null;
};

// required statics for component system
StackFSM.accessor = 'stackFSM'; // property name as it sits on an entity
StackFSM.className = 'STACK_FSM'; // name of component on the component definition object
StackFSM.priority = 5; // general position in the engine's component array; the lower, the earlier it's updated
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
	pushState: function(state, ctx) {
		if (state !== this._activeFunction) {
			this.stack.push(state);
			this._activeContext = ctx;
		}
	},
	
	popState: function() {
		return this.stack.pop();
	},
	
	update: function() {
		this._activeFunction = this.stack.length ? this.stack[this.stack.length - 1] : null;
		if (this._activeFunction) {
			// monitor changes so entity can react to unique situations
			if (this._activeFunction !== this._prevFunction) {
				this.stateChanged.dispatch(this._prevFunction ? this._prevFunction.name : 'null', this._activeFunction.name);
				this._prevFunction = this._activeFunction;
			}
			
			this._activeFunction.call(this._activeContext);
		}
	},
	
	dispose: function() {
		this._activeFunction = null;
		this._prevFunction = null;
		this.stack = null;
		this.stateChanged.dispose();
	}
};

return StackFSM;

});