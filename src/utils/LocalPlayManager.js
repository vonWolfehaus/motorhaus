define(function(require) {
	
// imports
var Kai = require('core/Kai');
var MathTools = require('math/MathTools');
var GamepadController = require('components/input/GamepadController');
var World = require('entities/World');

var Player = require('entities/GamepadPlayer');

// constructor
var LocalPlayManager = function() {
	var i;
	
	this.players = [];
	this.scoreboard = [0,0,0,0];
	
	Kai.pads = new GamepadController();
	Kai.pads.onConnect.add(this._padAdded, this);
	Kai.pads.onDisconnect.add(this._padRemoved, this);
	
	var centerX = World.width / 2;
	var centerY = World.height / 2;
	
	for (i = 0; i < 4; i++) {
		this.players[i] = new Player(MathTools.random(100) + centerX, MathTools.random(100) + centerY, i);
	}
};


LocalPlayManager.prototype = {
	constructor: LocalPlayManager,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	trackEntities: function(entities) {
		var i, obj;
		for (var i = 0; i < entities.length; i++) {
			obj = entities[i];
			// obj.health.onDeath.add();
			// obj.health.onActivate.add();
		};
		
	},
	
	update: function() {
		if (!Kai.inputBlocked) {
			Kai.pads.update();
		}
	},
	
	dispose: function() {
		Kai.pads.dispose();
		
		for (var i = 0; i < this.things.length; i++) {
			this.players[i].dispose();
		}
		this.players.length = 0;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_padAdded: function(pad) {
		var centerX = World.width / 2;
		var centerY = World.height / 2;
		this.players[pad.id].activate(MathTools.random(100) + centerX, MathTools.random(100) + centerY);
		console.log('[DemoArenaShooter.padAdded] Player '+(pad.id+1)+' joined');
	},
	
	_padRemoved: function(pad) {
		this.players[pad.id].disable();
		console.log('[DemoArenaShooter.padRemoved] Player '+(pad.id+1)+' left');
	},
	
};

return LocalPlayManager;

});