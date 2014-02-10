define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentType = require('components/ComponentDef');
var Tools = require('utils/Tools');
var PhysicsConstants = require('physics/PhysicsConstants');

// constructor
var Bullet = function(settings) {
	require('core/Base').call(this);
	
	var img = Kai.cache.getImage('bullet');
	var radius = Math.floor(img.height / 2);
	var diameter = radius * 2;
	
	// attributes
	this.speed = 700;
	this.damage = 25;
	this.hitpoints = 1; // how many points the owner gets if it hits another player
	this.parent = null; // turret
	this.pool = null; // automatically set by the pool itself
	
	Tools.merge(this, settings);
	
	this._owner = this.parent.parent;
	this._sourceRect = new Rectangle(this._owner.id*diameter, 0, diameter, diameter);
	
	// base components
	this.position = new Vec2();
	this.velocity = new Vec2();
	
	// complex components
	Kai.addComponent(this, ComponentType.TIMER, {
		interval: 3000,
		repeat: 1
	});
	Kai.addComponent(this, ComponentType.BODY_RADIAL_COLLIDER2, {
		mass: 1,
		radius: 5,
		maxSpeed: this.speed,
		hasAccel: false,
		collisionId: this._owner.uniqueId,
		hasFriction: false,
		autoAdd: false, // bullets should always stay off the grid
		boundaryBehavior: PhysicsConstants.BOUNDARY_DISABLE
	});
	Kai.addComponent(this, ComponentType.COLLISION_SCANNER_RADIAL, {
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
		sourceRect: this._sourceRect
	});
	
	// limited life
	this.timer.onInterval.add(this.disable, this);
	
	// the scanner takes over collision detection by looking at the grid for entities without
	// being in the grid itself. this way bullets never see each other, just entities
	this.collisionScanner.onCollision.add(this._onCollision, this);
	// but we still need to know when we go out of bounds so we can disable
	this.body.onCollision.add(this._onCollision, this);
	
	this.disable();
};


Bullet.prototype = {
	constructor: Bullet,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function(pos, vel) {
		this.position.copy(pos);
		this.velocity.copy(vel);
		
		this.active = true;
		this.collisionScanner.active = true;
		// console.log(this._owner);
		this.body.collisionId = this._owner.body.collisionId;
		this.body.activate();
		this.view.activate();
		this.timer.activate();
		this._sourceRect.x = this._owner.id*this.view.height;
		this.view.configure({
			sourceRect: this._scratchRect
		});
	},
	
	disable: function() {
		this.active = false;
		this.collisionScanner.active = false;

		this.body.disable();
		this.view.disable();
		this.timer.disable();
		this.pool.recycle(this);
	},
	
	dispose: function() {
		Kai.removeComponent(this, ComponentType.TIMER);
		Kai.removeComponent(this, ComponentType.BODY_RADIAL_COLLIDER2);
		Kai.removeComponent(this, ComponentType.SCANNER_GRID_RADIAL);
		Kai.removeComponent(this, ComponentType.VIEW_EASEL_BITMAP);
		// null references
		this.position = null;
		this.velocity = null;
		this.parent = null;
		this.pool = null;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_onCollision: function(other) {
		if (!other) {
			this.disable();
			return;
		} else if (other.entity.health && other.entity.id !== this._owner.id) {
			other.entity.health.change(-this.damage);
			Kai.scoreboard.changeScore(this._owner.id, this.hitpoints);
			this.disable();
		}
	}
	
};

return Bullet;

});