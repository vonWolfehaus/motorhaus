/**
 * A simple component that rotates our entity to always face the mouse's position, and move towards it.
 */
define(function(require) {

// imports
var Kai = mh.Kai;
var Tools = mh.Tools;
var Vec2 = mh.Vec2;

// constructor
var SeekMouse = function(entity, settings) {
	// augment with Base
	mh.Base.call(this);

	// attributes
	this.speed = 10;

	// attribute override
	Tools.merge(this, settings);

	// private properties
	this.entity = entity;


	// prerequisite components
	this.position = Kai.expect(entity, 'position', Vec2);
	this.rotation = Kai.expect(entity, 'rotation', Vec2);
};

// required statics for component system
SeekMouse.accessor = 'seek'; // property name as it sits on an entity
SeekMouse.className = 'SEEK_MOUSE'; // name of component on the ComponenDef object
SeekMouse.priority = 10; // general position in the engine's component array; highest updated first


SeekMouse.prototype = {
	constructor: SeekMouse,

	activate: function() {
		this.active = true;
	},

	disable: function() {
		this.active = false;
	},

	update: function() {
		// the mouse and keyboard are automatically updated elsewhere, so we simply get its current position this way
		var dx = Kai.mouse.position.x - this.position.x;
		var dy = Kai.mouse.position.y - this.position.y;

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

return SeekMouse;

});