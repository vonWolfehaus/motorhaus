define(function(require) {

// imports
var Kai = require('core/Kai');
var Grid = require('physics/CollisionGrid');
var World = require('entities/World');
var MathTools = require('math/MathTools');

var Circle = require('demo/entities/Circle');

// state constructors are only called ONCE per page load.
// use create() and dispose() to clean up, and the constructor to define properties
var GridCollision = function() {
	// add properties
	this.thing = null;
};

GridCollision.prototype = {
	
	preload: function () {
		
	},
	
	create: function () {
		var canvas = document.getElementById('stage');
		canvas.width = Kai.width;
		canvas.height = Kai.height;
		
		Kai.debugCtx = canvas.getContext('2d');
		
		World.set({
			width: Kai.width,
			height: Kai.height,
			friction: 0,
			gravity: 0
		});
		
		World.broadphase = new Grid(60);
		
		for (var i = 0; i < 300; i++) {
			o = new Circle({
				x: MathTools.random(0, Kai.width),
				y: MathTools.random(0, Kai.height),
				radius: MathTools.random(5, 20)
			});
			o.activate();
		}
		
		Kai.renderHook = this.draw.bind(this);
	},
	
	update: function () {
		World.broadphase.update();
	},
	
	draw: function () {
		Kai.debugCtx.clearRect(0, 0, Kai.width, Kai.height);
		World.broadphase.draw();
	},
	
	dispose: function() {
		this.thing.dispose();
		
		this.thing = null;
		Kai.renderHook = null;
		Kai.stage = null;
	}
};

return GridCollision;

});