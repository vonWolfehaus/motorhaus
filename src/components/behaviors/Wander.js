/**
 * 
 */
define(function(require) {
	
// imports
var Tools = require('utils/Tools');
var MathTools = require('math/MathTools');

// constructor
var Wander = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// attributes
	this.maxSpeed = 20;
	this.jitterAngle = 1;
	
	this.targetDistance = 20;
	this.targetRadius = 10;
	
	// attribute override
	Tools.merge(this, settings);
	
	
	// private properties
	this.entity = entity;
	this._wanderAngle = 0;
	this._circleCenter = new Vec2();
	this._displacement = new Vec2();
	
	// prerequisite components
	this.position = entity.position;
	this.velocity = entity.velocity;
	this.accel = entity.accel;
	this.rotation = entity.rotation;
};

// required statics for component system
Wander.accessor = 'wander'; // property name as it sits on an entity
Wander.className = 'WANDER_BEHAVIOR'; // name of component on the ComponenDef object
Wander.priority = 10; // general position in the engine's component array; highest updated first


Wander.prototype = {
	constructor: Wander,
	
	activate: function() {
		this.active = true;
	},
	
	disable: function() {
		this.active = false;
	},
	
	// http://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-wander--gamedev-1624
	update: function() {
		// Calculate the circle center
		this._circleCenter.copy(this.velocity);
		this._circleCenter.normalize();
		this._circleCenter.multiplyScalar(this.targetDistance);
		
		// Calculate the displacement force
		this._displacement.reset(0, -1);
		this._displacement.multiplyScalar(this.targetRadius);
		
		// Randomly change the vector direction by making it change its current angle
		this.setAngle(this._displacement, this._wanderAngle);
		// this._displacement.setAngle(this._wanderAngle);
		
		// Change wanderAngle just a bit, so it won't have the same value in the next game frame
		this._wanderAngle += Math.random() * this.jitterAngle - this.jitterAngle * 0.5;
		
		this.velocity.add(this._circleCenter.add(this._displacement));
		this.velocity.truncate(this.maxSpeed);
		
		this.rotation.copy(this.velocity);
		/*steering = wander()
		steering = truncate (steering, max_force)
		steering = steering / mass
		velocity = truncate (velocity + steering , max_speed)
		position = position + velocity*/
	},
	
	// Vec2 has this but it's different, see how this works first
	setAngle: function(vector, value) {
		var len = vector.getLength();
		vector.x = Math.cos(value) * len;
		vector.y = Math.sin(value) * len;
	},
	
	// this is nice?
	getShortRotation: function(angle) {
		angle %= MathTools.TAU;
		if (angle > Math.PI) {
			angle -= MathTools.TAU;
		} else if (angle < -Math.PI) {
			angle += MathTools.TAU;
		}
		return angle;
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// null references
		this.entity = null;
		this.position = null;
	}
};

return Wander;

});