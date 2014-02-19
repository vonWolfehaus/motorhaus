define(function(require) {
	
// imports
var Kai = von.Kai;
var VonComponents = von.VonComponents;

var CustomComponents = require('components/CustomComponents');

// constructor
var Beetle = function() {
	von.Base.call(this);
	
	var img = Kai.cache.getImage('beetle');
	var radius = Math.floor(img.height / 2);
	var diameter = radius * 2;
	
	// attributes
	
	// base components
	this.position = new Vec2();
	this.velocity = new Vec2();
	this.accel = new Vec2();
	this.rotation = new Vec2();
	
	// complex components
	Kai.addComponent(this, CustomComponents.VIEW_EASEL_BITMAP, {
		image: img,
		width: diameter,
		height: diameter
	});
	Kai.addComponent(this, CustomComponents.SEEK_MOUSE, {
		speed: 10
	});
	
	// unique component configuration
	this.view.configure({
		regX: radius,
		regY: radius,
		sourceRect: new createjs.Rectangle(this.id*diameter, 0, diameter, diameter)
	});
	
	this.disable();
};


Beetle.prototype = {
	constructor: Beetle,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function(pos) {
		this.position.copy(pos);
		this.active = true;

		this.view.activate();
		this.seek.activate();
		console.log('Beetle is active at '+this.position);
	},
	
	disable: function() {
		this.active = false;
		
		this.velocity.reset();
		this.accel.reset();
		this.view.disable();
		this.seek.disable();
	},
	
	dispose: function() {
		// dispose components
		Kai.removeComponent(this, ComponentType.VIEW_EASEL_BITMAP);
		
		// null references
		this.position = null;
		this.velocity = null;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	
	
};

return Beetle;

});