define(function(require) {
	
// imports
var Kai = require('core/Kai');
var VonComponents = require('components/VonComponents');
var MathTools = require('math/MathTools');
var Tools = require('utils/Tools');

// constructor
var Circle = function(settings) {
	require('core/Base').call(this);
	
	// attributes
	this.speed = 100;
	this.radius = 10;
	
	Tools.merge(this, settings);
	
	// base components
	this.position = new Vec2(settings.x || 0, settings.y || 0);
	this.velocity = new Vec2(this.speed, this.speed);
	// this.velocity = new Vec2(MathTools.random(this.speed), MathTools.random(this.speed));
	
	// complex components
	Kai.addComponent(this, VonComponents.BODY_RADIAL_COLLIDER2, {
		radius: this.radius,
		restitution: 1
	}); // body
	
};


Circle.prototype = {
	constructor: Circle,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function() {
		this.active = true;
		this.body.activate();
		// this.body.solid = false;
	},
	
	disable: function() {
		this.active = false;
		this.body.disable();
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// dispose components
		Kai.removeComponent(this, VonComponents.BODY_RADIAL_COLLIDER2);
		
		// null references
		this.position = null;
		this.velocity = null;
	}
	
};

return Circle;

});