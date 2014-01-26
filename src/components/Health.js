define(function(require) {
	
// imports
var Tools = require('utils/Tools');

// constructor
var Health = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// attributes
	this.max = 100;
	this.overage = 0;
	this.alive = false;
	this.active = false; // this component doesn't need to be updated
	
	// attribute override
	Tools.merge(this, settings);
	
	this.onDeath = new Signal();
	this.onDamage = new Signal();
	this.onHeal = new Signal();
	this.onFull = new Signal();
	this.onActivate = new Signal();
	
	// private properties
	this.entity = entity;
	this._meter = 0;
};

// required statics for component system
Health.accessor = 'health'; // property name as it sits on an entity
Health.className = 'HEALTH'; // name of component on the ComponenDef object
Health.priority = 1; // general position in the engine's component array; highest updated first


Health.prototype = {
	constructor: Health,
	
	activate: function() {
		this._meter = this.max;
		this.alive = true;
		this.onActivate.dispatch(this.entity);
	},
	
	change: function(amount) {
		if (!this.alive) return 0;
		
		this._meter += amount;
		
		if (this._meter <= 0) {
			this._meter = 0;
			this.alive = false;
			
			this.onDeath.dispatch(amount);
		} else {
			if (this._meter > this.max + this.overage) {
				this._meter = this.max;
				
				this.onFull.dispatch(amount);
			}
			
			if (amount < 0) this.onDamage.dispatch(amount);
			else this.onHeal.dispatch(amount);
		}
		
		return this._meter;
	},
	
	drain: function(amount) {
		if (!this.alive) return 0;
		
		if (this._meter > this.max) {
			this._meter -= amount;
			if (this._meter <= this.max) {
				this._meter = this.max;
				
				this.onFull.dispatch(amount);
			}
		}
		return this._meter;
	},
	
	dispose: function() {
		// remove signal callbacks
		this.onDeath.dispose();
		this.onDamage.dispose();
		this.onHeal.dispose();
		this.onFull.dispose();
		
		// null references
		this.entity = null;
		this.deathSignal = null;
		this.onDamage = null;
		this.onHeal = null;
		this.onFull = null;
	}
};

return Health;

});