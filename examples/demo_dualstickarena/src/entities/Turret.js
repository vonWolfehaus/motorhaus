define(function(require) {
	
// imports
// var Kai = require('core/Kai');
// var ComponentType = require('components/ComponentType');
// var MathTools = require('math/MathTools');
var DualPool = require('utils/DualPool');
var Tools = require('utils/Tools');
var World = require('entities/World');

var Bullet = require('./Bullet');

// constructor
var Turret = function(parent, settings) {
	require('core/Base').call(this);
	
	// attributes
	this.emitDistance = 20;
	this.fireRate = 20; // milliseconds, ish
	this.parent = parent;
	
	Tools.merge(this, settings);
	
	// base components
	this.position = parent.position;
	this.rotation = parent.rotation;
	this.emitPoint = new Vec2();
	this.emitVelocity = new Vec2();
	
	this._pool = new DualPool(Bullet, {
		parent: this
	}, 20);
};


Turret.prototype = {
	constructor: Turret,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function() {
		this.active = true;
	},
	
	disable: function() {
		this.active = false;
		this._pool.freeAll();
	},
	
	fire: function(angle) {
		if (!this.active) return;
		var angle = angle || Math.atan2(this.rotation.y, this.rotation.x);
		var cos = Math.cos(angle), sin = Math.sin(angle);
		var bullet = this._pool.get();
		
		this.emitPoint.x = cos * this.emitDistance + this.position.x;
		this.emitPoint.y = sin * this.emitDistance + this.position.y;
		this.emitVelocity.x = cos * bullet.speed;
		this.emitVelocity.y = sin * bullet.speed;
		
		bullet.activate(this.emitPoint, this.emitVelocity);
	},
	
	dispose: function() {
		this._pool.dispose();
		this._pool = null;
		this.position = null;
		this.emitPoint = null;
		this.emitVelocity = null;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_bulletCollision: function(a, b) {
		
	}
	
};

return Turret;

});