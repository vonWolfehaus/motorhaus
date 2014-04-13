define(function(require) {
	
// imports
var Kai = require('core/Kai');
var World = require('core/World');
var Tools = require('utils/Tools');
var VonComponents = require('components/VonComponents');
var CustomType = require('ai/CustomComponents');
var MathTools = require('math/MathTools');
var PhysicsConstants = require('physics/PhysicsConstants');

var Steering = require('ancillary/Steering');
var BoidGroup = require('entities/BoidGroup');

// constructor
var DroneBoidy = function(posx, posy, settings) {
	require('core/Base').call(this);
	
	// private
	var img = Kai.cache.getImage('beetle');
	var radius = Math.floor(img.height / 2);
	var diameter = radius * 2;
	
	// attributes
	this.maxSpeed = 150;
	
	Tools.merge(this, settings);
	
	// base components
	this.position = new Vec2(posx, posy);
	this.accel = new Vec2();
	this.velocity = new Vec2();
	
	// ai components
	Kai.addComponent(this, VonComponents.BOID); // applies steering force to velocity
	Kai.addComponent(this, VonComponents.STACK_FSM); // allows us to create intricate and unique ai behavior
	
	// collision is required by boid because it needs a broadphase to "see" other boids with
	Kai.addComponent(this, VonComponents.BODY_RADIAL_COLLIDER2, {
		radius: radius,
		// mass affects the boid's steering force, which affects ultimate velocity (so that steering force has less overall effect)
		// so if you raise mass, also raise boid.maxForce to get better ("more") behavior... unless you want a lumbering giant after all
		mass: 1,
		restitution: 0.4,
		hasFriction: false, // IMPORTANT: must be off--friction will limit steering forces so max speed cannot be achieved when it's in effect
		boundaryBehavior: PhysicsConstants.BOUNDARY_BOUNCE
	});
	Kai.addComponent(this, CustomType.VIEW_VON_SPRITE, {
		image: img,
		width: diameter,
		height: diameter,
		container: Kai.layer
	});
	
	// push a default.initial state
	this.stackFSM.pushState(this.idle, this);
	
	// idle the boid
	this.boid.steeringForce.reset();
	this.boid.groupControl.add(this.groupAction, this);
};


DroneBoidy.prototype = {
	constructor: DroneBoidy,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	groupAction: function(groupState) {
		switch (groupState) {
			case BoidGroup.ATTACHED:
				this.stackFSM.pushState(this.grouped, this);
				break;
			case BoidGroup.DETACHED:
				if (this.stackFSM.state === 'grouped') {
					this.stackFSM.popState();
				}
				break;
		}
	},
	
	activate: function() {
		this.active = true;
		this.view.activate();
		this.body.activate();
		this.boid.activate();
		this.stackFSM.activate();
		this.velocity.reset();
	},
	
	disable: function() {
		this.active = false;
		this.view.disable();
		this.body.disable();
		this.boid.disable();
		this.stackFSM.disable();
	},
	
	dispose: function() {
		// dispose components
		Kai.removeComponent(this, VonComponents.STACK_FSM);
		Kai.removeComponent(this, VonComponents.BOID);
		Kai.removeComponent(this, VonComponents.BODY_RADIAL_COLLIDER2);
		Kai.removeComponent(this, VonComponents.VIEW_VON_SPRITE);
		
		// null references
		this.position = null;
		this.velocity = null;
		this.accel = null;
	},
	
	/*-------------------------------------------------------------------------------
									BEHAVIORS: called every tick by StackFSM
	-------------------------------------------------------------------------------*/
	
	// IMPORTANT NOTE: if we don't name the function, then the StackFSM will return empty strings for the state change,
	// since otherwise they're anonymous functions and StackFSM uses Function.name (an ES6 feature) in its Signal.
	
	idle: function idle() {
		this.velocity.multiplyScalar(0.9);
		this.boid.steeringForce.x = 0;
		this.boid.steeringForce.y = 0;
	},
	
	grouped: function grouped() {
		
	}
	
};

return DroneBoidy;

});