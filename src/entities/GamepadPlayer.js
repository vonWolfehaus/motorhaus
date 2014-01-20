define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentDef = require('components/ComponentDef');
// var MathTools = require('math/MathTools');

// constructor
var GamepadPlayer = function(posx, posy, padId) {
	require('core/Base').call(this);
	
	// attributes
	this.id = padId;
	this.pad = Kai.pads.controllers[padId];
	this.speed = 1;
	
	// base components
	this.position = new Vec2(posx, posy);
	this.velocity = new Vec2();
	
	// complex components
	// Kai.addComponent(this, ComponentDef.THING, {foo:2});
	
	this.pad.onDown.add(this._btnDown, this);
	this.pad.onUp.add(this._btnUp, this);
};


GamepadPlayer.prototype = {
	constructor: GamepadPlayer,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	update: function() {
		if (this.pad.isDown(XBOX.X)) {
			// console.log(this.pad.rightAxis);
		}
		
		if (this.pad.isDown(XBOX.RT)) {
			// console.log(this.pad.rightTrigger);
		}
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