define(function(require) {
	
// imports
var XboxGamepad = require('components/input/XboxGamepad');

// constructor
var GamepadController = function() {
	var i;
	
	// attributes
	this.controllers = [];
	this.onConnect = new Signal();
	this.onDisconnect = new Signal();
	this.activeControllers = 0;
	
	// private
	this._controllerStatus = [];
	
	for (i = 0; i < 4; i++) {
		this.controllers[i] = new XboxGamepad(i);
		this._controllerStatus[i] = false;
	}
	
	window.addEventListener('gamepadconnected', this._onConnect.bind(this), false);
	window.addEventListener('gamepaddisconnected', this._onDisconnect.bind(this), false);
};

GamepadController.prototype = {
	constructor: GamepadController,
	
	_addPad: function(gamepad) {
		var ctrl = this.controllers[gamepad.index];
		ctrl.register(gamepad);
		this.onConnect.dispatch(ctrl);
		this.activeControllers++;
		// console.log('addPad');
	},
	
	_removePad: function(gamepad) {
		var ctrl = gamepad.index ? this.controllers[gamepad.index] : this.controllers[gamepad];
		ctrl.unregister();
		this.onDisconnect.dispatch(ctrl);
		this.activeControllers--;
		// console.log('removePad');
	},
	
	_onConnect: function(evt) {
		this._addPad(evt.gamepad);
	},
	
	_onDisconnect: function(evt) {
		this._removePad(evt.gamepad);
	},
	
	_scan: function() {
		var i, gamepads = navigator.webkitGetGamepads();
		for (i = 0; i < gamepads.length; i++) {
			if (gamepads[i]) {
				if (this._controllerStatus[i]) {
					// this is fucking pathetic, we should be getting live references!
					this.controllers[i].setPad(gamepads[i]);
				} else {
					this._addPad(gamepads[i]);
					this._controllerStatus[i] = true;
				}
				
			} else if (!gamepads[i] && this._controllerStatus[i]) {
				this._removePad(i);
				this._controllerStatus[i] = false;
			}
		}
	},
	
	update: function() {
		var i, ctrl;
		if (navigator.webkitGetGamepads) {
			this._scan(); // this should not be necessary!
		}
		for (i = 0; i < 4; i++) {
			ctrl = this.controllers[i];
			if (ctrl.active) {
				ctrl.update();
			}
		}
	},
	
	activate: function() {
		
	},
	
	dispose: function() {
		// null references
		this.controllers = null;
		this.onConnect = null;
		this.onDisconnect = null;
		this._controllerStatus = null;
	}
};

return GamepadController;

});