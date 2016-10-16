/*
	Component description
*/
mh.ComponentThing = function(entity, settings) {
	settings = settings || {};
	mh.Base.call(this); // always extend Base

	// attributes
	this.foo = config.foo;

	// attribute override
	mh.util.overwrite(this, settings);

	// other properties
	this.entity = entity;

	// prerequisite components
	this.position = mh.kai.expect(entity, 'position', Vec2);
};

// required statics for component system
mh.ComponentThing.accessor = 'thing'; // property name as it sits on an entity
mh.ComponentThing.className = 'THING_COMPONENT'; // name of component on the mh.Component object
mh.ComponentThing.priority = 10; // general position in the engine's component array; updated in ascending order
mh.ComponentThing.post = false; // whether or not this component will have a postUpdate() called on it

mh.ComponentThing.prototype = {
	constructor: mh.ComponentThing,

	activate: function() {
		this.active = true;
	},

	disable: function() {
		this.active = false;
	},

	update: function() {

	},

	dispose: function() {
		// remove signal callbacks

		// null references
		this.entity = null;
		this.position = null;
	}
};
