define(function(require) {
	
// imports
var Tools = require('utils/Tools');

/*
	Basic timer for use on components.
*/
var Timer = function(settings) {
	// attributes
	this.repeat = -1; // set to -1 to repeat forever
	this.immediateDispatch = false;
	this.interval = 1000; // milliseconds
	
	// attribute override
	Tools.merge(this, settings);
	
	this.onInterval = new Signal();
	
	// private properties
	this._timer = 0;
	this._numTicks = 0;
	this._currentRepeat = this.repeat;
};

Timer.prototype = {
	constructor: Timer,
	
	start: function() {
		this._timer = performance.now();
		this._currentRepeat = this.repeat;
		this._numTicks = 0;
		if (this.immediateDispatch) {
			this._numTicks++;
			this.onInterval.dispatch(this._numTicks);
		}
	},
	
	update: function() {
		if (performance.now() - this._timer >= this.interval) {
			this._numTicks++;
			this.onInterval.dispatch(this._numTicks);
			
			if (this.repeat !== -1 && this._currentRepeat-- === 0) {
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
	}
};

return Timer;

});