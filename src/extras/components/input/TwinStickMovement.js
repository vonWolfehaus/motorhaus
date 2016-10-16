/*
	Converts a gamepad's analog sticks into acceleration (left) and rotation (right) vectors
	for Geometry Wars style controls.
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
mh.TwinStickMovement = function(entity, settings) {
	settings = settings || {};
	mh.Base.call(this);

	// attributes
	this.speed = 1;
	this.pad = null;

	// attribute override
	mh.util.overwrite(this, settings);

	// private properties
	this.entity = entity;

	// prerequisite components
	this.accel = entity.accel;
	this.rotation = entity.rotation;

	this.active = false;
};

// required statics for component system
mh.TwinStickMovement.accessor = 'input'; // property name as it sits on an entity
mh.TwinStickMovement.className = 'INPUT_TWINSTICK'; // name of component on the ComponenDef object
mh.TwinStickMovement.priority = 20; // general position in the engine's component array; highest updated first

mh.TwinStickMovement.prototype = {
	constructor: mh.TwinStickMovement,

	activate: function() {
		this.accel.x = this.accel.y = 0;
		this.rotation.x = this.rotation.y = 0;
		this.active = true;
	},

	disable: function() {
		this.active = false;
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
