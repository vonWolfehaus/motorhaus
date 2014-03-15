define(function(require) {
	
// imports
// var Kai = require('core/Kai');
// var MathTools = require('math/MathTools');

// constructor
var Particle = function(posx, posy) {
	require('core/Base').call(this);
	
	// attributes
	this.rotation = 0;
	this.alpha = 1;
	this.speed = 100;
	this.lifespan = 5000; // ms
	
	// base components
	this.position = new Vec2(posx, posy);
	this.velocity = new Vec2(MathTools.random(this.speed), MathTools.random(this.speed));
	
	// complex components
	// add your own sprite
};


Particle.prototype = {
	constructor: Particle,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function() {
		this.active = true;
		// this.view.
		this.view.activate();
	},
	
	disable: function() {
		this.active = false;
		this.view.disable();
	},
	
	dispose: function() {
		// null references
		this.position = null;
		this.velocity = null;
	}
	
};

return Particle;

});