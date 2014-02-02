define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentType = require('components/ComponentDef');
var MathTools = require('math/MathTools');

// constructor
var PointPlate = function(posx, posy) {
	require('core/Base').call(this);
	
	var img = Kai.cache.getImage('pointplate');
	var radius = img.height / 2;
	
	// attributes
	this.owner = null;
	this.awardInterval = 5000;
	this.awardAmount = 10;
	
	this.buildRadius = 100;
	this.buildAmount = 10;
	
	// base components
	this.position = new Vec2(posx, posy);
	this.velocity = new Vec2();
	
	// complex components
	Kai.addComponent(this, ComponentType.VIEW_EASEL_BITMAP, {
		image: img,
		regX: radius,
		regY: radius/*,
		width: diameter,
		height: diameter,
		sourceRect: new createjs.Rectangle(4*diameter, 0, diameter, diameter)*/
	});
	Kai.addComponent(this, ComponentType.BODY_RADIAL_COLLIDER2, {
		mass: 0,
		radius: radius,
		autoAdd: false
	});
	Kai.addComponent(this, ComponentType.SCANNER_GRID_RADIAL, {
		scanRadius: radius
	});
	Kai.addComponent(this, ComponentType.TIMER, {
		interval: this.awardInterval,
		immediateDispatch: true
	});
	
	this.scanner.onCollision.add(this._onCollision, this);
	this.timer.onInterval.add(this._awardPoints, this);
	
	
	// always on
	this.view.activate();
	this.body.activate();
	this.timer.activate();
	this.scanner.active = true;
};


PointPlate.prototype = {
	constructor: PointPlate,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function(owner) {
		if (this.owner) {
			this.owner.requestMinion.remove(this._buildMinion, this);
		}
		this.owner = owner;
		this.timer.reset();
		this.owner.requestMinion.add(this._buildMinion, this);
		// this.view.setFrame(this.owner.id);
	},
	
	disable: function() {
		this.owner = null;
	},
	
	dispose: function() {
		
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_buildMinion: function(player) {
		console.log(this.position.distanceTo(player.position));
		if (this.position.distanceTo(player.position) < this.buildRadius) {
			if (Kai.scoreboard.getScore(player.id) >= this.buildAmount) {
				// console.log('you have a new minion');
			} else {
				// console.log('not enough points');
			}
		}
	},
	
	_onCollision: function(other) {
		if (this.owner === other.entity) {
			return;
		}
		
		this.activate(other.entity);
	},
	
	_awardPoints: function() {
		if (this.owner) {
			Kai.scoreboard.changeScore(this.owner.id, this.awardAmount);
		}
	}
	
};

return PointPlate;

});