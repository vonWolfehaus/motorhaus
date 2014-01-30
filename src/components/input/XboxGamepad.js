define(function(require) {
	
// imports
var Kai = require('core/Kai');

// constructor
var XboxGamepad = function(id) {
	require('core/Base').call(this);
	
	// attributes
	this.id = id;
	this.onDown = new Signal();
	this.onUp = new Signal();
	
	// NOTE: 'up' is y-, 'right' is x+, all values normalized
	this.leftAxis = new Vec2();
	this.rightAxis = new Vec2();
	this.leftTrigger = 0;
	this.rightTrigger = 0;
	
	// xbox controllers are sticky and don't zero well apparently
	this.axisTolerance = 0.12;
	
	
	this.controller = null;
	this.buttons = null;
	
	this._numButtons = 0;
	this._mozAxisOffset = 0;
	this._prevButtons = [];
};

XboxGamepad.prototype = {
	constructor: XboxGamepad,
	
	register: function(ctrlr) {
		this.setPad(ctrlr);
		this._numButtons = this.buttons.length;
		
		if (!!navigator.webkitGetGamepads) {
			this._mozAxisOffset = 0;
		} else {
			this._mozAxisOffset = 1;
		}
		
		this.activate();
		// console.log('[XboxGamepad.register] CONNECTED '+this.id);
		// console.log(this.buttons);
	},
	
	setPad: function(ctrlr) {
		this.controller = ctrlr;
		this.buttons = ctrlr.buttons;
	},
	
	unregister: function() {
		this.controller = null;
		this.buttons = null;
		this._numButtons = 0;
		// console.log('[XboxGamepad.unregister] DISCONNECTED '+this.id);
	},
	
	update: function() {
		var i, btn;
		var leftX = this.controller.axes[0];
		var leftY = this.controller.axes[1];
		var rightX = this.controller.axes[2+this._mozAxisOffset];
		var rightY = this.controller.axes[3+this._mozAxisOffset];
		
		if (leftX < this.axisTolerance && leftX > -this.axisTolerance) { leftX = 0; }
		if (leftY < this.axisTolerance && leftY > -this.axisTolerance) { leftY = 0; }
		if (rightX < this.axisTolerance && rightX > -this.axisTolerance) { rightX = 0; }
		if (rightY < this.axisTolerance && rightY > -this.axisTolerance) { rightY = 0; }
		
		this.leftAxis.x = leftX;
		this.leftAxis.y = leftY;
		this.rightAxis.x = rightX;
		this.rightAxis.y = rightY;
		
		for (i = 0; i < this._numButtons; i++) {
			btn = this.buttons[i];
			
			if (i === 6) {
				this.leftTrigger = btn.value || btn;
			} else if (i === 7) {
				this.rightTrigger = btn.value || btn;
			}
			
			if (btn && !this._prevButtons[i]) {
				this.onDown.dispatch(i, btn);
			} else if (!btn && this._prevButtons[i]) {
				this.onUp.dispatch(i, btn);
			}
			
			this._prevButtons[i] = btn;
			
		}
	},
	
	isDown: function(btn) {
		if (Kai.inputBlocked || !this.active) {
			return false;
		}
		return !!this.buttons[btn];
	},
	
	activate: function() {
		this.active = true;
		this.leftAxis.x = 0;
		this.leftAxis.y = 0;
		this.rightAxis.x = 0;
		this.rightAxis.y = 0;
		this.leftTrigger = 0;
		this.rightTrigger = 0;
		for (i = 0; i < this._numButtons; i++) {
			this.buttons[i] = 0;
			this._prevButtons[i] = 0;
		}
	},
	
	disable: function() {
		this.active = false;
	},
	
	dispose: function() {
		// remove signal callbacks
		this.onDown.dispose();
		this.onUp.dispose();
		
		// null references
		this.onDown = null;
		this.onUp = null;
	}
};

window.XBOX = {
	A: 0,
	B: 1,
	X: 2,
	Y: 3,
	LB: 4,
	RB: 5,
	LT: 6,
	RT: 7,
	SELECT: 8,
	START: 9,
	LSTICK: 10,
	RSTICK: 11,
	UP: 12,
	DOWN: 13,
	LEFT: 14,
	RIGHT: 15
};

return XboxGamepad;

});
