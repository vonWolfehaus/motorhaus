define(function(require) {
	
// imports
var Tools = require('utils/Tools');

// constructor
var Timer = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// attributes
	this.repeat = -1; // set to -1 to repeat forever
	this.immediateDispatch = false;
	this.interval = 1000; // milliseconds
	
	// attribute override
	Tools.merge(this, settings);
	
	this.onInterval = new Signal();
	
	// private properties
	this.entity = entity;
	this._timer = 0;
	this._currentRepeat = this.repeat;
	
	this.disable();
};

// required statics for component system
Timer.accessor = 'timer'; // property name as it sits on an entity
Timer.className = 'TIMER'; // name of component on the ComponenDef object
Timer.priority = 13; // general position in the engine's component array; highest updated first


Timer.prototype = {
	constructor: Timer,
	
	activate: function() {
		this._timer = performance.now();
		this.active = true;
		this._currentRepeat = this.repeat;
		if (this.immediateDispatch) {
			this.onInterval.dispatch();
		}
	},
	
	disable: function() {
		this.active = false;
	},
	
	reset: function() {
		this._timer = performance.now();
		if (this.active && this.immediateDispatch) {
			this.onInterval.dispatch();
		}
	},
	
	update: function() {
		if (performance.now() - this._timer >= this.interval) {
			this.onInterval.dispatch();
			
			if (this.repeat !== -1 && this._currentRepeat-- <= 0) {
				this.disable();
				return;
			}
			this._timer = performance.now();
		}
	},
	
	dispose: function() {
		// remove signal callbacks
		this.onInterval.dispose();
		
		// null references
		this.onInterval = null;
		this.entity = null;
	}
};

return Timer;

});