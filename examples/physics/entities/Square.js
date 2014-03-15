define(function(require) {
	
// imports
var Kai = require('core/Kai');
var VonComponents = require('components/VonComponents');
var MathTools = require('math/MathTools');

// constructor
var Square = function(posx, posy) {
	require('core/Base').call(this);
	
	// attributes
	this.speed = 20;
	this.width = 55;
	this.height = 55;
	
	var sharedAttr = {
		width: this.width,
		height: this.height
	};
	
	// base components
	this.position = new Vec2(posx, posy);
	this.velocity = new Vec2(MathTools.random(this.speed), MathTools.random(this.speed));
	// complex components
	Kai.addComponent(this, VonComponents.OCAN_SQUARE, sharedAttr); // view
	Kai.addComponent(this, VonComponents.AABB2, sharedAttr); // body
	
};


Square.prototype = {
	constructor: Square,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function() {
		this.view.active = true;
		this.body.active = true;
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// dispose components
		Kai.removeComponent(this, VonComponents.OCAN_SQUARE);
		Kai.removeComponent(this, VonComponents.AABB2);
		
		// null references
		this.position = null;
		this.velocity = null;
	}
	
};

return Square;

});