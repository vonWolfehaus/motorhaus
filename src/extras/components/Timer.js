mh.Timer = function(entity, settings) {
	// augment with Base
	mh.Base.call(this);

	settings = settings || {};
	var config = {
		repeat: -1, // set to -1 to repeat forever
		immediateDispatch: false,
		interval: 1000 // milliseconds
	};
	// attribute override
	config = mh.util.merge(config, settings);

	this.onInterval = new Signal();

	// private properties
	this.entity = entity;
	this._timer = 0;
	this._numTicks = 0;
	this._currentRepeat = this.repeat;

	this.disable();
};

// required statics for component system
mh.Timer.accessor = 'timer'; // property name as it sits on an entity
mh.Timer.className = 'TIMER'; // name of component on the ComponenDef object
mh.Timer.priority = 13; // general position in the engine's component array; updated according to ascending order


mh.Timer.prototype = {
	constructor: mh.Timer,

	activate: function() {
		this._timer = performance.now();
		this.active = true;
		this._currentRepeat = this.repeat;
		this._numTicks = 0;
		if (this.immediateDispatch) {
			this._numTicks++;
			this.onInterval.dispatch(this._numTicks);
		}
	},

	disable: function() {
		this.active = false;
	},

	reset: function() {
		this._timer = performance.now();
		this._numTicks = 0;
		if (this.active && this.immediateDispatch) {
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
		this.entity = null;
	}
};
