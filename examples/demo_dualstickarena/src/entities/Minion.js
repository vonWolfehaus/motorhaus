define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentType = require('components/ComponentDef');
var Tools = require('utils/Tools');
var MathTools = require('math/MathTools');

var Turret = require('./Turret');

// constructor
var Minion = function(settings) {
	require('core/Base').call(this);
	
	var img = Kai.cache.getImage('minions');
	var radius = Math.floor(img.height / 2);
	var diameter = radius * 2;
	
	// attributes
	this.fireRate = 500;
	
	Tools.merge(this, settings);
	
	this._owner = null;
	this._scratchRect = new createjs.Rectangle(0, 0, diameter, diameter);
	
	// base components
	this.position = new Vec2();
	this.velocity = new Vec2(/*MathTools.random(10, 20), MathTools.random(10, 20)*/);
	this.accel = new Vec2();
	this.rotation = new Vec2();
	
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
	/*Kai.addComponent(this, ComponentType.TARGET_BEHAVIOR, {
		
	});*/
	
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
		
		this._owner = owner;
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
		// if (this.targeter.hasTarget()) {
			this.turret.fire();
		// }
	},
	
	_uponDeath: function(amount) {
		this.disable();
		// TODO: special effects
	}
	
};

return Minion;

});