/*
	Controls the acceleration of an entity and enables steering behaviors to be used.
*/
define(function(require) {

// constructor
var Boid = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);

	// these are values that achieve optimal behavioral effects--use as a starting point
	this.maxForce = 10;
	// arrive
	this.slowingRadius = 50;
	this.pathArriveRadius = 50;
	// follow leader
	// this.leaderBehindDist = 100;
	// this.leaderSightRadius = 300;
	// flocking--these defaults are for entities with a 50 pixel radius
	this.groupID = 0;
	this.flockRadius = 160; // distance where flocking (alignment) starts to happen
	this.maxCohesion = 140; // radius within which cohesion rule is in effect
	this.minSeparation = 70; // distance at which separation rule goes into effect
	// wander
	this.angleJitter = 0.9;
	this.targetDistance = 20;
	this.targetRadius = 20;

	// attribute override
	mh.util.merge(this, settings);

	this.entity = entity;
	this.steeringForce = new Vec2(mh.util.random(this.maxForce), mh.util.random(this.maxForce));

	this.maxSpeed = this.entity.maxSpeed || this.maxForce;
	if (entity.body) {
		this.maxSpeed = entity.body.maxSpeed;
	}

	// private properties
	this._wanderAngle = 0;
	// this._prevAngle = 0;
	this._currentPathNode = 0;
	this._pathDir = 1;
	this._arrived = false;

	// prerequisite components
	this.position = Kai.expect(entity, 'position', Vec2);
	this.rotation = Kai.expect(entity, 'rotation', Vec2);
	this.velocity = Kai.expect(entity, 'velocity', Vec2);

	this.groupControl = new Signal();
};

// required statics for component system
Boid.accessor = 'boid'; // property name as it sits on an entity
Boid.className = 'BOID'; // name of component on the component definition object
Boid.priority = 95; // just before the physics components (at 100) but otherwise dead last
Boid.post = false; // whether or not this component will have a postUpdate() called on it

Boid.prototype = {
	constructor: Boid,

	activate: function() {
		this.active = true;
		this._currentPathNode = 0;
		this._pathDir = 1;
		this._arrived = false;
	},

	disable: function() {
		this.active = false;
	},

	update: function() {
		// steeringForce has been modified by Steering so cap it and apply
		this.steeringForce.truncate(this.maxForce);

		// let physical mass affect movement
		this.steeringForce.multiplyScalar(this.entity.body.invmass);
		// DebugDraw.vector(Kai.debugCtx, this.steeringForce, this.position);

		this.velocity.x += this.steeringForce.x;
		this.velocity.y += this.steeringForce.y;

		// adjust rotation to match the velocity vector--the view component will take care of the rest
		this.rotation.x = this.velocity.x;
		this.rotation.y = this.velocity.y;

		// reset for next time, so steering forces get applied in the updates of other components
		this.steeringForce.x = 0;
		this.steeringForce.y = 0;
	},

	dispose: function() {
		this.groupControl.dispose();
		this.groupControl = null;
		this.entity = null;
		this.steeringForce = null;
		this.position = null;
		this.rotation = null;
		this.velocity = null;
	}
};

return Boid;

});