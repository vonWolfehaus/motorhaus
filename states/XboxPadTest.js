define(function(require) {

// imports
var Kai = require('core/Kai');
var GamepadController = require('components/input/GamepadController');

var Player = require('entities/GamepadPlayer');

var XboxPadTest = function() {
	Kai.pads = new GamepadController();
	Kai.pads.onConnect.add(this.padAdded, this);
	Kai.pads.onDisconnect.add(this.padRemoved, this);
	
	this.players = [];
	this.things = [];
};

XboxPadTest.prototype = {
	
	preload: function () {
		// console.log('[XboxPadTest.preload]');
		// Kai.load.image('preloaderBackground', 'images/preloader_background.jpg');
		// Kai.load.image('preloaderBar', 'images/preloadr_bar.png');
		
		// crimson land?
	},

	create: function () {
		// console.log('[XboxPadTest.create]');
		var canvas = document.getElementById('stage');
		Kai.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, canvas, true);
        Kai.stage = new PIXI.Stage();
		
		for (var i = 0; i < 4; i++) {
			this.players[i] = new Player(100 * i + 200, 100 * i + 200, i);
		}
		
		Kai.renderHook = this.draw.bind(this);
		
		console.log('[XboxPadTest.create] Running');
	},
	
	padAdded: function(pad) {
		this.players[pad.id].reset(100 * pad.id + 200, 100 * pad.id + 200);
		console.log('[XboxPadTest.padRemoved] Player '+(pad.id+1)+' joined');
	},
	
	padRemoved: function(pad) {
		this.players[pad.id].active = false;
		console.log('[XboxPadTest.padRemoved] Player '+(pad.id+1)+' left');
	},
	
	update: function () {
		var player;
		Kai.pads.update();
		for (var i = 0; i < 4; i++) {
			player = this.players[i];
			if (player.active) {
				player.update();
			}
		}
	},
	
	draw: function () {
		Kai.renderer.render(Kai.stage);
	},
	
	dispose: function() {
		Kai.pads.dispose();
		for (var i = 0; i < this.things.length; i++) {
			this.things[i].dispose();
		}
		this.things = null;
	}
};

return XboxPadTest;

});