define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentType = require('components/ComponentDef');
var MathTools = require('math/MathTools');
var World = require('entities/World');

var Turret = require('entities/Turret');

// constructor
var GamepadPlayer = function(posx, posy, padId) {
	require('core/Base').call(this);
	
	var img = Kai.cache.getImage('players');
	var radius = Math.floor(img.height / 2);
	var diameter = radius * 2;
	
	// attributes
	this.id = padId;
	this.pad = Kai.pads.controllers[padId];
	this.fireRate = 130;
	
	// base components
	this.position = new Vec2(posx, posy);
	this.velocity = new Vec2();
	this.accel = new Vec2();
	this.rotation = new Vec2();
	
	// complex components
	Kai.addComponent(this, ComponentType.TIMER, {
		interval: this.fireRate,
		immediateDispatch: true
	});
	Kai.addComponent(this, ComponentType.BODY_RADIAL_COLLIDER2, {
		mass: 20,
		radius: radius,
		maxSpeed: 300,
		hasAccel: true,
		hasFriction: true,
		collisionId: this.uniqueId
	});
	Kai.addComponent(this, ComponentType.HEALTH, {
		max: 200
	});
	Kai.addComponent(this, ComponentType.INPUT_TWINSTICK, {
		pad: this.pad, 
		speed: 100
	});
	Kai.addComponent(this, ComponentType.VIEW_EASEL_BITMAP, {
		image: img,
		width: diameter,
		height: diameter
	});
	
	// unique component configuration
	this.view.configure({
		regX: radius,
		regY: radius,
		sourceRect: new createjs.Rectangle(this.id*diameter, 0, diameter, diameter)
	});
	
	// other entities
	this.turret = new Turret(this);
	
	// signals
	this.health.onDeath.add(this._uponDeath, this);
	this.pad.onDown.add(this._btnDown, this);
	this.pad.onUp.add(this._btnUp, this);
	this.timer.onInterval.add(this._timeToDance, this);
	
	this.disable();
};


GamepadPlayer.prototype = {
	constructor: GamepadPlayer,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function(x, y) {
		this.position.x = x;
		this.position.y = y;
		this.active = true;

		this.view.activate();
		this.body.activate();
		this.health.activate();
		this.input.activate();
		this.turret.activate();
		console.log('Player is active at '+this.position);
	},
	
	disable: function() {
		this.active = false;
		
		this.velocity.reset();
		this.accel.reset();
		this.body.disable();
		this.view.disable();
		this.turret.disable();
		this.timer.disable();
	},
	
	dispose: function() {
		// remove signal callbacks
		this.pad.onDown.remove(this._btnDown, this);
		this.pad.onUp.remove(this._btnUp, this);
		
		// dispose components
		Kai.removeComponent(this, ComponentType.BODY_RADIAL_COLLIDER2);
		Kai.removeComponent(this, ComponentType.HEALTH);
		Kai.removeComponent(this, ComponentType.INPUT_TWINSTICK);
		Kai.removeComponent(this, ComponentType.VIEW_EASEL_BITMAP);
		Kai.removeComponent(this, ComponentType.TIMER);
		
		// null references
		this.position = null;
		this.velocity = null;
		this.pad = null;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_timeToDance: function() {
		if (this.pad.isDown(XBOX.LT) || this.pad.isDown(XBOX.RT)) {
			this.turret.fire();
		}
	},
	
	_uponDeath: function(amount) {
		this.disable();
		// TODO: special effects
	},
	
	_btnDown: function(btn, val) {
		if (!this.active) {
			if (btn === XBOX.START) {
				var centerX = World.width / 2;
				var centerY = World.height / 2;
				this.activate(MathTools.random(100) + centerX, MathTools.random(100) + centerY);
			}
			return;
		}
		// console.log(this.pad.buttons[btn]);
		switch (btn) {
			case XBOX.A:
				// console.log('Player '+this.id+': A is down: '+val);
				// console.log(this.turret._pool.toString());
				console.log(World.camera.position);
				break;
			
			// BUY MINIONS
			case XBOX.LB:
			case XBOX.RB:
				
				break;
			
			case XBOX.LT:
			case XBOX.RT:
				this.timer.activate();
				break;
				
			// MINION CONTROL
			case XBOX.DOWN:
				// wander
				World.scale--;
				break;
			case XBOX.UP:
				// follow
				World.scale++;
				break;
			case XBOX.LEFT:
				// seek and harass other players
				break;
			case XBOX.RIGHT:
				// patrol between plates
				break;
		}
	},
	
	_btnUp: function(btn, val) {
		if (!this.active) return;
		switch (btn) {
			case XBOX.LT:
			case XBOX.RT:
				this.timer.disable();
				break;
		}
	}
	
};

return GamepadPlayer;

});