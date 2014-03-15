/**
 * Class description
 */
define(function(require) {
	
// imports
var Kai = require('core/Kai');
var Tools = require('utils/Tools');

// constructor
var Emitter = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// attributes
	this.interval = 25; // ms
	
	// attribute override
	Tools.merge(this, settings);
	
	// other properties
	this.entity = entity;
	
	// prerequisite components
	this.position = Kai.expect(entity, 'position', Vec2);
	this.velocity = Kai.expect(entity, 'velocity', Vec2);
	
	this._emitVelocity = new Vec2();
	
	this._pool = new DualPool(Particle, {
		parent: this
	}, 30);
	
	this.timer.onInterval.add(this.emit, this);
};

// required statics for component system
Emitter.accessor = 'emitter'; // property name as it sits on an entity
Emitter.className = 'EMITTER_BASIC'; // name of component on the component definition object
Emitter.priority = 10; // general position in the engine's component array; updated in ascending order
Emitter.post = false; // whether or not this component will have a postUpdate() called on it


Emitter.prototype = {
	constructor: Emitter,
	
	activate: function() {
		this.active = true;
		this.timer.activate();
	},
	
	disable: function() {
		this.active = false;
		this._pool.freeAll();
		this.timer.disable();
	},
	
	update: function() {
		
	},
	
	dispose: function() {
		// remove signal callbacks
		this.timer.onInterval.remove(this.emit, this);
		
		// dispose components
		Kai.removeComponent(this, ComponentType.TIMER);
		
		// null references
		this.position = null;
		this.velocity = null;
		
		this._pool.dispose();
		this._pool = null;
	},
	
	emit: function(a) {
		if (!this.active) return;
		var angle = a || Math.atan2(this.rotation.y, this.rotation.x);
		var cos = Math.cos(angle), sin = Math.sin(angle);
		var particle = this._pool.get();
		
		this._emitVelocity.x = cos * particle.speed;
		this._emitVelocity.y = sin * particle.speed;
		
		particle.activate(this.position, this._emitVelocity);
	}
};

return Emitter;

});