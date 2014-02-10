define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentType = require('components/ComponentDef');
var MathTools = require('math/MathTools');
var DualPool = require('utils/DualPool');

var Minion = require('./Minion');

// constructor
var PointPlate = function(posx, posy) {
	require('core/Base').call(this);
	
	var img = Kai.cache.getImage('pointplate');
	var radius = img.height / 2;
	var diameter = radius * 2;
	
	// attributes
	this.owner = null;
	this.awardInterval = 3000;
	this.awardAmount = 10;
	this.ownerTimeout = 5; // plate goes neutral after this time (* awardInterval)
	
	this.supply = 10; // arbitrary points for how many minions this plate can support
	this.cost = 1; // later, different minions will have various costs
	
	this.buildRadius = 100;
	this.buildAmount = 5;
	
	// base components
	this.position = new Vec2(posx, posy);
	this.velocity = new Vec2();
	
	// complex components
	Kai.addComponent(this, ComponentType.VIEW_EASEL_BITMAP, {
		image: img,
		width: diameter,
		height: diameter
	});
	Kai.addComponent(this, ComponentType.BODY_RADIAL_COLLIDER2, {
		mass: 0,
		radius: radius,
		autoAdd: false
	});
	Kai.addComponent(this, ComponentType.COLLISION_SCANNER_RADIAL, {
		scanRadius: radius
	});
	Kai.addComponent(this, ComponentType.TIMER, {
		interval: this.awardInterval,
		repeat: this.ownerTimeout,
		immediateDispatch: true
	});
	
	this._scratchRect = new Rectangle(4*diameter, 0, diameter, diameter);
	// unique component configuration
	this.view.configure({
		regX: radius,
		regY: radius,
		sourceRect: this._scratchRect
	});
	
	this.collisionScanner.onCollision.add(this._onCollision, this);
	this.timer.onInterval.add(this._awardPoints, this);
	
	this._currentSupply = this.supply;
	this._pool = new DualPool(Minion, {
		parent: this
	}, 5);
	
	// always on
	this.view.activate();
	this.body.activate();
	this.timer.activate();
	this.collisionScanner.active = true;
};


PointPlate.prototype = {
	constructor: PointPlate,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function(owner) {
		if (!owner.requestMinion) {
			// not a player, ignore
			return;
		}
		if (this.owner) {
			this.owner.requestMinion.remove(this._buildMinion, this);
		}
		this._currentSupply = this.supply;
		this.owner = owner;
		this.timer.activate();
		this.owner.requestMinion.add(this._buildMinion, this);
		this._neutralityTimer = 0;
		// this.view.setFrame(this.owner.id);
		this._scratchRect.x = owner.id * this.view.height;
		this.view.configure({
			sourceRect: this._scratchRect
		});
	},
	
	reset: function() {
		if (this.owner) {
			this.owner.requestMinion.remove(this._buildMinion, this);
		}
		this.owner = null;
		this.timer.disable();
		
		this._scratchRect.x = 4 * this.view.height;
		this.view.configure({
			sourceRect: this._scratchRect
		});
	},
	
	dispose: function() {
		
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_buildMinion: function(player) {
		// console.log(this.position.distanceTo(player.position));
		if (this._currentSupply >= this.cost && this.position.distanceTo(player.position) < this.buildRadius) {
			if (Kai.scoreboard.getScore(player.id) >= this.buildAmount) {
				Kai.scoreboard.changeScore(this.owner.id, -this.buildAmount);
				
				var minion = this._pool.get();
				minion.activate(this.position, this.owner);
				minion.health.onDeath.addOnce(this._onMinionDeath, this);
				
				this._currentSupply -= this.cost;
				
			} else {
				// console.log('not enough points');
			}
		}
	},
	
	_onMinionDeath: function(minion, amount) {
		this._currentSupply += this.cost;
	},
	
	_onCollision: function(other) {
		if (this.owner === other.entity) {
			return;
		}
		
		this.activate(other.entity);
	},
	
	_awardPoints: function(tick) {
		if (this.owner) {
			Kai.scoreboard.changeScore(this.owner.id, this.awardAmount);
			
			if (tick === this.timer.repeat) {
				// console.log('last tick');
				this.reset();
			}
		}
	}
	
};

return PointPlate;

});