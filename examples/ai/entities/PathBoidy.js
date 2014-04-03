define(function(require) {
	
// imports
var Kai = require('core/Kai');
var World = require('core/World');
var Tools = require('utils/Tools');
var VonComponents = require('components/VonComponents');
var CustomType = require('ai/CustomComponents');
var MathTools = require('math/MathTools');
var PhysicsConstants = require('physics/PhysicsConstants');
var DebugDraw = require('utils/DebugDraw');

var Steering = require('ancillary/Steering');

// constructor
var PathBoidy = function(posx, posy, settings) {
	require('core/Base').call(this);
	
	// private
	var img = Kai.cache.getImage('beetle');
	var radius = Math.floor(img.height / 2);
	var diameter = radius * 2;
	
	// attributes
	this.maxSpeed = 120;
	
	Tools.merge(this, settings);
	
	this._group = new LinkedList();
	this._path = new LinkedList();
	// random starting offset so the refresh call of all boids is distributed across multiple frames, causing less performance strain
	this._refreshGroupInterval = MathTools.randomInt(0, 6);
	
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
	
	this.stackFSM.stateChanged.add(this._stateChanged, this);
	
	// push a default.initial state
	this.stackFSM.pushState(this.seekMouse, this);
};


PathBoidy.prototype = {
	constructor: PathBoidy,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function() {
		this.active = true;
		this.view.activate();
		this.body.activate();
		this.boid.activate();
		this.stackFSM.activate();
	},
	
	disable: function() {
		this.active = false;
		this.view.disable();
		this.body.disable();
		this.boid.disable();
		this.stackFSM.disable();
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// dispose components
		Kai.removeComponent(this, VonComponents.STACK_FSM);
		Kai.removeComponent(this, VonComponents.BOID);
		Kai.removeComponent(this, VonComponents.BODY_RADIAL_COLLIDER2);
		Kai.removeComponent(this, VonComponents.VIEW_VON_SPRITE);
		
		// null references
		this.position = null;
		this.velocity = null;
	},
	
	
	
	/*-------------------------------------------------------------------------------
									BEHAVIORS: called every tick by StackFSM
	-------------------------------------------------------------------------------*/
	
	// IMPORTANT NOTE: if we don't name the function, then the StackFSM will return empty strings for the state change,
	// since otherwise they're anonymous functions and StackFSM uses Function.name (an ES6 feature) in its Signal.
	
	seekMouse: function seekMouse() {
		this.flock();
		Steering.seek(this.boid, Kai.mouse.position, this.boid.slowingRadius);
		
		if (this.path.length) {
			this.stackFSM.pushState(this.followPath, this);
		}
	},
	
	followPath: function followPath() {
		this.flock();
		Steering.followPath(this.boid, this.path, true);
	},
	
	flock: function flock() {
		if (--this._refreshGroupInterval === 0) {
			// throttle this call because it's *really* expensive, and no one will notice anyway
			World.broadphase.getNeighbors(this.body, this.boid.flockRadius, this._group);
			this._refreshGroupInterval = 3;
		}
		
		Steering.flock(this.boid, this._group);
		
		// DEBUG DRAWING
		var node = this._group.first;
		var t = 100 * this.boid.groupID;
		var color = 'rgb('+t+','+0+','+t+')';
		while (node) {
			var a = node.obj.entity;
			if (a !== this) {
				DebugDraw.vectorLine(Kai.debugCtx, this.position, a.position, color);
			}
			node = node.next;
		}
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_stateChanged: function(oldState, newState) {
		// console.log('[PathBoidy._stateChanged] from '+oldState+' to '+newState);
	}
	
};

return PathBoidy;

});