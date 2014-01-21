define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentDef = require('components/ComponentDef');
// var MathTools = require('math/MathTools');

// constructor
var GamepadPlayer = function(posx, posy, padId) {
	require('core/Base').call(this);
	
	var texture = PIXI.Texture.fromImage('../img/beetle.png');

	// attributes
	this.id = padId;
	this.pad = Kai.pads.controllers[padId];
	this.speed = 5;
	
	// base components
	this.position = new Vec2(posx, posy);
	this.velocity = new Vec2();
	this.accel = new Vec2();
	this.rotation = this.pad.rightAxis;
	
	
	// complex components
	// Kai.addComponent(this, ComponentDef.THING, {foo:2});
	this.sprite = new PIXI.Sprite(texture);
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	this.sprite.visible = true;
	Kai.stage.addChild(this.sprite);
	
	// link
	this.sprite.position = this.position;
	
	this.pad.onDown.add(this._btnDown, this);
	this.pad.onUp.add(this._btnUp, this);
};


GamepadPlayer.prototype = {
	constructor: GamepadPlayer,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	reset: function(x, y) {
		this.active = true;
		this.position.x = x;
		this.position.y = y;
		console.log('Player is active');
	},
	
	update: function() {
		if (this.pad.isDown(XBOX.X)) {
			// console.log(this.pad.rightAxis);
		}
		
		if (this.pad.isDown(XBOX.RT)) {
			// console.log(this.pad.rightTrigger);
		}
		
		this.velocity.copy(this.pad.leftAxis).multiplyScalar(this.speed);
		this.position.add(this.velocity);
		
		if (this.rotation.y !== 0 || this.rotation.x !== 0) {
			this.sprite.rotation = Math.atan2(this.rotation.y, this.rotation.x);
		}
		
		if (this.position.x > window.innerWidth) this.position.x = window.innerWidth;
		if (this.position.x < 0) this.position.x = 0;
		if (this.position.y > window.innerHeight) this.position.y = window.innerHeight;
		if (this.position.y < 0) this.position.y = 0;
	},
	
	dispose: function() {
		// remove signal callbacks
		this.pad.onDown.remove(this._btnDown, this);
		this.pad.onUp.remove(this._btnUp, this);
		
		// dispose components
		// Kai.removeComponent(this, ComponentDef.THING);
		
		// null references
		this.position = null;
		this.velocity = null;
		this.pad = null;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_btnDown: function(btn, val) {
		// console.log(this.pad.buttons[btn]);
		switch (btn) {
			case XBOX.A:
				// console.log('Player '+this.id+': A is down: '+val);
				break;
			case XBOX.RT:
				// console.log('Player '+this.id+': right trigger is down: '+val);
				break;
			case XBOX.DOWN:
				// console.log('down');
				break;
		}
	},
	
	_btnUp: function(btn, val) {
		switch (btn) {
			case XBOX.A:
				// console.log('Player '+this.id+': A is up: '+val);
				break;
		}
	}
	
};

return GamepadPlayer;

});