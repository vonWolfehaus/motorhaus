/**
 * A simple component that rotates our entity to always face the mouse's position, and move towards it.
 */
ex.SeekMouse = function(entity, settings) {
	settings = settings || {};
	mh.Base.call(this);

	// attributes
	this.speed = 10;

	// attribute override
	mh.util.overwrite(this, settings);

	// private properties
	this.entity = entity;

	// prerequisite components
	this.position = mh.kai.expect(entity, 'position', mh.Vec2);
	this.rotation = mh.kai.expect(entity, 'rotation', mh.Vec2);
};

// required statics for component system
ex.SeekMouse.accessor = 'seek'; // property name as it sits on an entity
ex.SeekMouse.className = 'SEEK_MOUSE'; // name of component on the ComponenDef object
ex.SeekMouse.priority = 10; // general position in the engine's component array; highest updated first

ex.SeekMouse.prototype = {
	constructor: ex.SeekMouse,

	activate: function() {
		this.active = true;
	},

	disable: function() {
		this.active = false;
	},

	update: function() {
		// the mouse and keyboard are automatically updated elsewhere, so we simply get its current position this way
		var dx = mh.kai.mouse.position.x - this.position.x;
		var dy = mh.kai.mouse.position.y - this.position.y;

		if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
			return;
		}

		var angle = Math.atan2(dy, dx);
		this.position.x += Math.cos(angle) * this.speed;
		this.position.y += Math.sin(angle) * this.speed;

		// the view component also references the entity's rotation property and sets the bitmap's angle
		// accordingly on its own update call.
		this.rotation.x = dx;
		this.rotation.y = dy;
	},

	dispose: function() {
		// remove signal callbacks

		// null references
		this.entity = null;
		this.position = null;
		this.rotation = null;
	}
};
