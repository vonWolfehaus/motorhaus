/*
	Component description
*/
mh.ComponentThing = function(entity, settings) {
	mh.Base.call(this); // always extend Base

	settings = settings || {};
	var config = {
		foo: 1
	};
	// attribute override
	config = mh.util.merge(config, settings);

	// public properties
	this.foo = config.foo;

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
