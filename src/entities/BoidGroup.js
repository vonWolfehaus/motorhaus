/*
	Controls a group of Boids for optimal pathing.
	http://www.gamasutra.com/view/feature/131721/implementing_coordinated_movement.php?print=1
*/
define(function(require) {
	
// imports
var Kai = require('core/Kai');
var Tools = require('utils/Tools');
var DualPool = require('utils/DualPool');
var Steering = require('ancillary/Steering');
var VonComponents = require('components/VonComponents');

// constructor
var BoidGroup = function(settings) {
	require('core/Base').call(this);
	
	// these are values that achieve optimal behavioral effects--use as a starting point
	this.maxForce = 9999999; // this gets overwritten by the slowest member of the group
	// arrive
	this.slowingRadius = 70;
	this.pathArriveRadius = 100;
	this.groupID = 0;
	this.repeat = false;
	// wander?
	// this.angleJitter = 0.9;
	// this.targetDistance = 20;
	// this.targetRadius = 20;
	
	// attribute override
	Tools.merge(this, settings);
	
	this.members = new LinkedList();
	this.steeringForce = new Vec2();
	
	// private properties
	// this._wanderAngle = 0;
	this._currentPathNode = 0;
	this._pathDir = 1;
	this._arrived = true;
	this._nodePool = new DualPool(Vec2, null, 5);
	
	// prerequisite components
	this.position = new Vec2(); // average position of all members
	this.velocity = new Vec2(); // magnitude and orientation of the group
	this.path = [];
	
	Kai.addComponent(this, VonComponents.STACK_FSM);
	
	this.stackFSM.stateChanged.add(this._stateChanged, this);
};

// constants for passing into boid Signals
BoidGroup.DETACHED = 0;
BoidGroup.ATTACHED = 1;

BoidGroup.prototype = {
	constructor: BoidGroup,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	addBoid: function(boid) {
		boid.groupID = this.groupID;
		this.members.add(boid);
		if (boid.maxForce < this.maxForce) {
			this.maxForce = boid.maxForce;
		}
	},
	
	addEntity: function(entity) {
		if (!entity.boid) {
			console.warn('[BoidGroup.addEntity] All entities added to BoidGroup must have boid components');
			return;
		}
		this.addBoid(entity.boid);
	},
	
	removeBoid: function(boid) {
		var a, node;
		this.members.remove(boid);
		this.maxForce = 9999999;
		
		if (this.members.length === 0) {
			this.disable();
			return;
		}
		
		node = this.members.first;
		while (node) {
			a = node.obj;
			if (boid.maxForce < this.maxForce) {
				this.maxForce = boid.maxForce;
			}
			node = node.next;
		}
	},
	
	removeEntity: function(entity) {
		this.removeBoid(entity.boid);
	},
	
	removeAll: function() {
		this.members.clear();
		this.disable(); // no group to move, so we're done
	},
	
	addWaypoint: function(x, y) {
		var v = this._nodePool.get();
		v.x = x;
		v.y = y;
		this.path.push(v);
		
		this.stackFSM.pushState(this.followPath, this);
		this._arrived = false;
	},
	
	// we usually get a full path from some pathfinding algorithm, so this will non-destructively
	// set the new path and kick us off properly
	setPath: function(newPath) {
		var i, v;
		// just in case our path was switched in medias res
		this._nodePool.freeAll();
		this.path.length = 0;
		
		for (i = 0; i < newPath.length; i++) {
			v = newPath[i];
			this.addWaypoint(v.x, v.y);
		}
		
		this.stackFSM.pushState(this.followPath, this);
	},
	
	/*sendCommand: function(newState) {
		var entity, node = this.members.first;
		while (node) {
			entity = node.obj.entity;
			if (entity.stackFSM) {
				entity.stackFSM.stateChanged.dispatch(newState);
			}
			node = node.next;
		}
	},*/
	
	activate: function() {
		this.active = true;
		this.stackFSM.activate();
	},
	
	disable: function() {
		this.active = false;
		this.reset();
		this.stackFSM.disable();
	},
	
	reset: function() {
		// note: entities must be managed independently! this only handles the path of the group
		this.velocity.x = 0;
		this.velocity.y = 0;
		this._nodePool.freeAll();
		this.path.length = 0;
		this._currentPathNode = 0;
		this._pathDir = 1;
		this._arrived = true;
	},
	
	dispose: function() {
		Kai.removeComponent(this, VonComponents.STACK_FSM);
		this.members.dispose();
		this.members = null;
		this._nodePool.dispose();
		this._nodePool = null;
		
		this.steeringForce = null;
		this.position = null;
		this.velocity = null;
		this.path = null;
	},
	
	/*-------------------------------------------------------------------------------
									BEHAVIORS: called every tick by StackFSM
	-------------------------------------------------------------------------------*/
	
	followPath: function followPath() {
		var a, node = this.members.first;
		
		Steering.followPath(this, this.path, this.repeat);
		
		// update group position and apply new force to each member
		this.position.x = 0;
		this.position.y = 0;
		
		while (node) {
			a = node.obj;
			if (a.groupID !== this.groupID) {
				// the entity must have been taken away from us by something, like a short attention span
				this.removeBoid(a);
				node = node.next;
				continue;
			}
			
			Steering.flock(a, this.members);
			
			this.position.add(a.position);
			a.velocity.add(this.steeringForce);
			node = node.next;
		}
		this.position.divideScalar(this.members.length);
		
		this.steeringForce.x = 0;
		this.steeringForce.y = 0;
		
		if (this._arrived) {
			this.stackFSM.popState();
		}
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_stateChanged: function(oldState, newState) {
		var target, a, node = this.members.first;
		
		if (oldState === newState) {
			return;
		}
		
		switch (newState) {
			case 'followPath':
				this.activate();
				this._currentPathNode = 0;
				this._pathDir = 1;
				this._arrived = false;
				target = this.path[this._currentPathNode];
				this.velocity.copy(target);
				this.velocity.normalize().multiplyScalar(this.maxForce);
				
				// notify members
				while (node) {
					a = node.obj;
					a.groupControl.dispatch(BoidGroup.ATTACHED);
					node = node.next;
				}
				break;
				
			default:
				// a state we don't have (ie idle), so we're done
				this.disable();
				
				// notify members
				while (node) {
					a = node.obj;
					a.groupControl.dispatch(BoidGroup.DETACHED);
					node = node.next;
				}
				break;
		}
	}
};

return BoidGroup;

});