define(function(require) {
	
// imports
var Tools = require('utils/Tools');
var World = require('entities/World');
var PhysicsConstants = require('physics/PhysicsConstants');

// constructor
var RadialColider2 = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// attributes
	this.radius = 25;
	this.mass = 100; // 0 is immobile
	this.invmass = 0; // never adjust this directly! use setMass() instead
	this.restitution = 0.8; // bounciness, 0 to 1
	this.maxSpeed = 200;
	this.solid = true;
	this.hasAccel = false;
	this.hasFriction = false;
	this.autoAdd = true;
	this.collisionId = this.uniqueId;
	this.boundaryBehavior = PhysicsConstants.BOUNDARY_BOUNCE;
	
	// attribute override
	Tools.merge(this, settings);
	
	this.onCollision = new Signal();
	
	// private properties
	this.entity = entity;
	
	// prerequisite components
	this.position = entity.position;
	this.velocity = entity.velocity;
	if (this.hasAccel) {
		this.accel = entity.accel;
	}
	
	// init
	this.setMass(this.mass);
};

// required statics for component system
RadialColider2.accessor = 'body'; // property name as it sits on an entity
RadialColider2.className = 'BODY_RADIAL_COLLIDER2'; // name of component on the ComponenDef object
RadialColider2.priority = 1; // general position in the engine's component array; lowest updated first


RadialColider2.prototype = {
	constructor: RadialColider2,
	
	setMass: function(newMass) {
		this.mass = newMass;
		if (newMass <= 0) {
			this.invmass = 0;
		} else {
			this.invmass = 1 / newMass;
		}
	},
	
	activate: function() {
		this.solid = true;
		this.active = true;
		if (this.autoAdd) {
			World.broadphase.add(this);
		}
	},
	
	disable: function() {
		this.solid = false;
		this.active = false;
		if (this.autoAdd) {
			World.broadphase.remove(this);
		}
	},
	
	update: function() {
		this.velocity.y += World.gravity * World.elapsed;
		
		if (this.hasAccel) {
			this.velocity.x += this.accel.x;
			this.velocity.y += this.accel.y;
			this.velocity.truncate(this.maxSpeed);
		}
		
		if (this.hasFriction) {
			this.velocity.x *= World.friction;
			this.velocity.y *= World.friction;
		}
		
		this.position.x += this.velocity.x * World.elapsed;
		this.position.y += this.velocity.y * World.elapsed;
		
		switch (this.boundaryBehavior) {
			case PhysicsConstants.BOUNDARY_DISABLE:
				if (this.position.x < this.radius ||
				    this.position.x + this.radius > World.width ||
				    this.position.y < this.radius ||
				    this.position.y + this.radius > World.height) {
					this.onCollision.dispatch(null);
				}
				break;
				
			case PhysicsConstants.BOUNDARY_BOUNCE:
				if (this.position.x < this.radius) {
					this.position.x = this.radius;
					this.velocity.x = -this.velocity.x * this.restitution;
					
				} else if (this.position.x + this.radius > World.width) {
					this.position.x = World.width - this.radius;
					this.velocity.x = -this.velocity.x * this.restitution;
				}
				
				if (this.position.y < this.radius) {
					this.position.y = this.radius;
					this.velocity.y = -this.velocity.y * this.restitution;
					
				} else if (this.position.y + this.radius > World.height) {
					this.position.y = World.height - this.radius;
					this.velocity.y = -this.velocity.y * this.restitution;
				}
				break;
				
			case PhysicsConstants.BOUNDARY_WRAP:
				if (this.position.x < this.radius) {
					this.position.x += World.width + this.radius;
					
				} else if (this.position.x + this.radius > World.width) {
					this.position.x -= World.width - this.radius;
				}
				
				if (this.position.y < this.radius) {
					this.position.y += World.height + this.radius;
					
				} else if (this.position.y + this.radius > World.height) {
					this.position.y -= World.height - this.radius;
				}
				break;
		}
		
		// DebugDraw.circle(this.position.x - World.camera.position.x, this.position.y - World.camera.position.y, this.radius);
	},
	
	dispose: function() {
		// remove signal callbacks
		this.onCollision.dispose();
		
		// null references
		this.entity = null;
		this.position = null;
		this.velocity = null;
		this.onCollision = null;
	}
};

return RadialColider2;

});