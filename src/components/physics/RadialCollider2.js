define(function(require) {
	
// imports
var Kai = require('core/Kai');
var Tools = require('utils/Tools');
var World = require('core/World');
var PhysicsConstants = require('physics/PhysicsConstants');
var DebugDraw = require('utils/DebugDraw');

// constructor
var RadialColider2 = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// attributes
	this.radius = 25;
	this.mass = 5; // 0 is immobile
	this.invmass = 0; // never adjust this directly! use setMass() instead
	this.restitution = 0.8; // bounciness, 0 to 1
	this.solid = true;
	this.hasAccel = false;
	this.hasFriction = false;
	this.autoAdd = true;
	this.collisionId = this.uniqueId;
	this.boundaryBehavior = PhysicsConstants.BOUNDARY_BOUNCE;
	this.maxSpeed = entity.maxSpeed || 100;
	// this.brakeForce = 0.9;
	
	// attribute override
	Tools.merge(this, settings);
	
	this.onCollision = new Signal();
	
	// private properties
	this.entity = entity;
	
	// prerequisite components
	this.position = Kai.expect(entity, 'position', Vec2);
	this.velocity = Kai.expect(entity, 'velocity', Vec2);
	if (this.hasAccel) {
		this.accel = Kai.expect(entity, 'accel', Vec2);
	}
	
	// init
	this.setMass(this.mass);
};

// required statics for component system
RadialColider2.accessor = 'body'; // property name as it sits on an entity
RadialColider2.className = 'BODY_RADIAL_COLLIDER2'; // name of component on the ComponenDef object
RadialColider2.priority = 100; // general position in the engine's component array; lowest updated first
RadialColider2.post = false; // whether or not this component will have postUpdate() called on it


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
		this.velocity.y += World.gravity;
		
		if (this.hasAccel) {
			this.velocity.x += this.accel.x;
			this.velocity.y += this.accel.y;
			
			// this.accel.x *= this.brakeForce;
			// this.accel.y *= this.brakeForce;
		}
		this.velocity.truncate(this.maxSpeed);
		
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
				if (this.position.x < 0) {
					this.position.x += World.width;
					
				} else if (this.position.x > World.width) {
					this.position.x -= World.width;
				}
				
				if (this.position.y < 0) {
					this.position.y += World.height;
					
				} else if (this.position.y > World.height) {
					this.position.y -= World.height;
				}
				break;
		}
	},
	
	debugDraw: function(ctx) {
		if (World.camera) {
			DebugDraw.circle(ctx, this.position.x - World.camera.position.x, this.position.y - World.camera.position.y, this.radius);
		} else {
			DebugDraw.circle(ctx, this.position.x, this.position.y, this.radius);
		}
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