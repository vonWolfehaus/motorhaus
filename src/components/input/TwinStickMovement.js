define(function(require) {
	
// imports
var Tools = require('utils/Tools');

// constructor
var TwinStickMovement = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// attributes
	this.speed = 1;
	this.pad = null;
	
	// attribute override
	Tools.merge(this, settings);
	
	// private properties
	this.entity = entity;
	
	// prerequisite components
	this.accel = entity.accel;
	this.rotation = entity.rotation;
	
	this.active = false;
};

// required statics for component system
TwinStickMovement.accessor = 'input'; // property name as it sits on an entity
TwinStickMovement.className = 'INPUT_TWINSTICK'; // name of component on the ComponenDef object
TwinStickMovement.priority = 20; // general position in the engine's component array; highest updated first


TwinStickMovement.prototype = {
	constructor: TwinStickMovement,
	
	activate: function() {
		this.accel.x = this.accel.y = 0;
		this.rotation.x = this.rotation.y = 0;
		this.active = true;
	},
	
	update: function() {
		this.accel.copy(this.pad.leftAxis).multiplyScalar(this.speed);
		this.rotation.copy(this.pad.rightAxis);
	},
	
	dispose: function() {
		// null references
		this.entity = null;
		this.accel = null;
		this.rotation = null;
	}
};

return TwinStickMovement;

});