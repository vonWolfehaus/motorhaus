define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentType = require('components/ComponentDef');
var Tools = require('utils/Tools');
var MathTools = require('math/MathTools');
var Rectangle = require('math/Rectangle');

var Turret = require('./Turret');

// constructor
var Minion = function(settings) {
	require('core/Base').call(this);
	
	var img = Kai.cache.getImage('minions');
	var radius = Math.floor(img.height / 2);
	var diameter = radius * 2;
	
	// attributes
	this.fireRate = 500;
	this.id = 0;
	
	Tools.merge(this, settings);
	
	this._owner = null;
	this._scratchRect = new Rectangle(0, 0, diameter, diameter);
	
	// base components
	this.position = new Vec2();
	this.velocity = new Vec2(/*MathTools.random(10, 20), MathTools.random(10, 20)*/);
	this.accel = new Vec2();
	this.rotation = new Vec2();
	
	this._target = null;
	
	// complex components
	Kai.addComponent(this, ComponentType.BODY_RADIAL_COLLIDER2, {
		mass: 10,
		radius: radius,
		maxSpeed: 300,
		hasAccel: true,
		hasFriction: true,
		collisionId: this.uniqueId // with this the grid will ignore anything with the same id, like our bullets
	});
	Kai.addComponent(this, ComponentType.HEALTH, {
		max: 100
	});
	Kai.addComponent(this, ComponentType.VIEW_EASEL_BITMAP, {
		image: img,
		width: diameter,
		height: diameter
	});
	
	// ai components
	Kai.addComponent(this, ComponentType.TIMER, {
		interval: this.fireRate,
		immediateDispatch: true
	});
	Kai.addComponent(this, ComponentType.WANDER_BEHAVIOR, {
		maxSpeed: 190,
		jitterAngle: 0.5
	});
	Kai.addComponent(this, ComponentType.GRID_TARGETER, {
		searchInterval: 500,
		scanRadius: 800
	});
	
	// unique component configuration
	this.view.configure({
		regX: radius,
		regY: radius,
		sourceRect: this._scratchRect
	});
	
	this.health.onDeath.add(this._uponDeath, this);
	this.timer.onInterval.add(this._timeToDance, this);
	
	// other entities
	this.turret = new Turret(this, {
		fireRate: this.fireRate,
		emitDistance: 10
	});
	this.disable();
};


Minion.prototype = {
	constructor: Minion,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function(pos, owner) {
		this.active = true;
		this.position.copy(pos);

		this.view.activate();
		this.body.activate();
		this.health.activate();
		this.turret.activate();
		this.timer.activate();
		this.wander.activate();
		this.gridTargeter.activate();
		
		this._owner = owner;
		this.id = owner.id;
		this._scratchRect.x = owner.id * this.view.height;
		this.view.configure({
			sourceRect: this._scratchRect
		});
	},
	
	disable: function() {
		this.active = false;
		
		this.velocity.reset();
		this.accel.reset();
		this.body.disable();
		this.view.disable();
		this.turret.disable();
		this.timer.disable();
		this.wander.disable();
		this.gridTargeter.disable();
	},
	
	changeState: function(newState) {
		
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// dispose components
		
		
		// null references
		this.position = null;
		this.velocity = null;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_timeToDance: function() {
		var t = this.gridTargeter.target;
		if (!t) return;
		t = t.entity;
		if (t.id === this.id) return;
		if (t.active) {
			// point the turret at the target's new position
			var dx = t.position.x - this.position.x;
			var dy = t.position.y - this.position.y;
			this.turret.fire(Math.atan2(dy, dx));
		}
	},
	
	_uponDeath: function(amount) {
		this.disable();
		// TODO: special effects
	}
	
};

return Minion;

});