define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentType = require('components/VonComponents');
var MathTools = require('math/MathTools');

// constructor
var Thing = function(posx, posy) {
	require('core/Base').call(this);
	
	// attributes
	this.speed = 1;
	
	// base components
	this.position = new Vec2(posx, posy);
	this.velocity = new Vec2(MathTools.random(this.speed), MathTools.random(this.speed));
	
	// complex components
	Kai.addComponent(this, ComponentType.THING, {foo:2});
};


Thing.prototype = {
	constructor: Thing,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function() {
		this.active = true;
	},
	
	disable: function() {
		this.active = false;
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// dispose components
		Kai.removeComponent(this, ComponentType.THING);
		
		// null references
		this.position = null;
		this.velocity = null;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_signalCallback: function() {
		
	}
	
};

return Thing;

});