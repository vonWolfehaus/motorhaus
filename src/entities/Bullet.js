define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentType = require('components/ComponentDef');
var Tools = require('utils/Tools');
var MathTools = require('math/MathTools');

// constructor
var Bullet = function(settings) {
	require('core/Base').call(this);
	
	var img = Kai.cache.getImage('bullet');
	var radius = Math.floor(img.height / 2);
	var diameter = radius * 2;
	
	// attributes
	this.speed = 800;
	this.damage = 50;
	this.parent = null; // turret
	this.pool = null; // automatically set by the pool itself
	
	Tools.merge(this, settings);
	
	// base components
	this.position = new Vec2();
	this.velocity = new Vec2();
	
	Kai.addComponent(this, ComponentType.TIMER, {
		interval: 3000
	});
	Kai.addComponent(this, ComponentType.BODY_RADIAL_COLLIDER2, {
		mass: 1,
		radius: 5,
		maxSpeed: this.speed,
		hasAccel: false,
		collisionId: this.parent.parent.uniqueId,
		hasFriction: false,
		autoAdd: false // bullets always stay off the grid!
	});
	Kai.addComponent(this, ComponentType.SCANNER_GRID_RADIAL, {
		scanRadius: diameter * 2
	});
	Kai.addComponent(this, ComponentType.VIEW_EASEL_BITMAP, {
		image: img,
		width: diameter,
		height: diameter
	});
	
	// unique component configuration
	this.view.configure({
		regX: radius,
		regY: radius,
		sourceRect: new createjs.Rectangle(MathTools.randomInt(0, 4)*diameter, 0, diameter, diameter)
	});
	
	// limited life
	this.timer.onInterval.add(this.disable, this);
	
	// the scanner takes over collision detection by looking at the grid for entities without
	// being in the grid. this way bullets never see each other, just entities
	this.scanner.onCollision.add(this._onCollision, this);
	
	this.disable();
};


Bullet.prototype = {
	constructor: Bullet,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	configure: function(speed) {
		this.speed = speed;
	},
	
	activate: function(pos, vel) {
		this.position.copy(pos);
		this.velocity.copy(vel);
		
		this.active = true;
		this.body.active = true;
		this.scanner.active = true;
		this.view.activate();
		this.timer.activate();
	},
	
	disable: function() {
		this.active = false;
		this.body.active = false;
		this.scanner.active = false;
		this.view.disable();
		this.timer.disable();
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// null references
		this.position = null;
		this.velocity = null;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_onCollision: function(other) {
		if (other.entity.health) {
			other.entity.health.change(-this.damage);
			this.disable();
			this.pool.recycle(this);
			// console.log('TOTES COLLISION BRO');
		}
	}
	
};

return Bullet;

});