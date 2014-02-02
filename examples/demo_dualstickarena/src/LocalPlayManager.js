define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentType = require('components/ComponentDef');
var GamepadController = require('components/input/GamepadController');
var World = require('entities/World');

var Player = require('arena/entities/GamepadPlayer');

// constructor
var LocalPlayManager = function(numPlayers) {
	require('core/Base').call(this);
	var i, player;
	numPlayers = numPlayers || 4;
	
	this.activePlayers = 0;
	this.players = [];
	this.players.length = numPlayers;
	
	/*Kai.addComponent(this, ComponentType.TIMER, {
		interval: 3000,
		repeat: 0
	});
	this.timer.onInterval.add(this._resetGame, this);*/
	
	this._scratchVector = new Vec2();
	
	Kai.pads = new GamepadController();
	Kai.pads.onConnect.add(this._padAdded, this);
	Kai.pads.onDisconnect.add(this._padRemoved, this);
	
	for (i = 0; i < numPlayers; i++) {
		player = new Player(this.getRespawnPosition(i), i);
		player.requestRespawn.add(this._respawnPlayer, this);
		// player.health.onDeath.add(this._onPlayerDeath, this);
		// player.health.onActivate.add(this._onPlayerActivate, this);
		this.players[i] = player;
	}
	
	this.onGameStart = new Signal();
};


LocalPlayManager.prototype = {
	constructor: LocalPlayManager,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	getRespawnPosition: function(region) {
		region = region + 1 || 1;
		var centerX = (World.width / 2);
		var centerY = (World.height / 2);
		
		var nx = 0;
		var ny = 0;
		
		switch (region) {
			case 1:
				nx = (centerX / 2) * 1;
				ny = (centerY / 2) * 1;
				break;
			case 2:
				nx = (centerX / 2) * 1;
				ny = (centerY / 2) * 2;
				break;
			case 3:
				nx = (centerX / 2) * 2;
				ny = (centerY / 2) * 1;
				break;
			case 4:
				nx = (centerX / 2) * 2;
				ny = (centerY / 2) * 2;
				break;
		}
		
		return this._scratchVector.reset(nx, ny);
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
	
	/*_resetGame: function() {
		Kai.scoreboard.reset();
		for (var i = 0; i < this.players.length; i++) {
			this._respawnPlayer(i);
		}
	},*/
	
	/*_onPlayerDeath: function(amount, player) {
		this.activePlayers--;
		if (this.activePlayers === 1) {
			this.timer.activate();
		}
	},
	
	_onPlayerActivate: function(amount, player) {
		this.activePlayers++;
	},*/
	
	_respawnPlayer: function(id) {
		this.players[id].activate(this.getRespawnPosition(id));
	},
	
	_padAdded: function(pad) {
		this._respawnPlayer(pad.id);
		console.log('[DemoArenaShooter.padAdded] Player '+(pad.id+1)+' joined');
	},
	
	_padRemoved: function(pad) {
		this.players[pad.id].disable();
		console.log('[DemoArenaShooter.padRemoved] Player '+(pad.id+1)+' left');
	},
	
};

return LocalPlayManager;

});