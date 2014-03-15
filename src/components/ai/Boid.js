/**
 * Class description
 */
define(function(require) {
	
// imports
var Kai = require('core/Kai');
var Tools = require('utils/Tools');
// var Steering = require('ancillary/Steering');

// constructor
var Boid = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// public properties
	this.foo = 1;
	
	// attribute override
	Tools.merge(this, settings);
	
	// other properties
	this.entity = entity;
	
	// prerequisite components
	this.position = Kai.expect(entity, 'position', Vec2);
};

// required statics for component system
Boid.accessor = 'boid'; // property name as it sits on an entity
Boid.className = 'BOID'; // name of component on the component definition object
Boid.priority = 1; // general position in the engine's component array; updated in ascending order
Boid.post = false; // whether or not this component will have a postUpdate() called on it


Boid.prototype = {
	constructor: Boid,
	
	activate: function() {
		this.active = true;
	},
	
	disable: function() {
		this.active = false;
	},
	
	update: function() {
		truncate(steering, MAX_FORCE);
		
		if (this.entity.body) {
			steering.multiplyScalar(this.entity.body.invmass);
		}
		
		velocity = velocity.add(steering);
		truncate(velocity, MAX_VELOCITY);
		
		position = position.add(velocity);
		
		x = position.x;
		y = position.y;
		
		// Adjust boid rotation to match the velocity vector.
		rotation = (180 * getAngle(velocity)) / Math.PI;
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// null references
		this.entity = null;
		this.position = null;
	}
};

return Boid;

});