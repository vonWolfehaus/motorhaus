define(function(require) {

// imports
var Kai = require('core/Kai');
var World = require('entities/World');
var Grid = require('physics/CollisionGrid');
var GamepadController = require('components/input/GamepadController');
var DOMTools = require('utils/DOMTools');
var DebugDraw = require('utils/DebugDraw');

var Player = require('entities/GamepadPlayer');

/*
TODO

- change component naming convention to [ACCESSOR]_[THING]

- player management component
track active controllers, fire signal when all players pressed start.
control respawning.
tally scores.

- background (tilemap)
- camera (scroll and zoom to fit)

- point totals next to radar

at this point, remove other game code (references to minions) and push to github.
copy everything over to new private repo and continue work from there.

- create new input component
input components are specific to games, so we have our arena shooter twin stick controls and affect accel and rotation

- point plates (touch to control, time = points)
sitting nearby, player can press bumper to convert 10 points to a minion

- new player graphic
- resize minion to be smaller?

- minions
wander in squads of 5 (first 4 always follow owner)
dpad switch minion modes

- game timer
- radar at top?
*/

var XboxPadTest = function() {
	Kai.pads = new GamepadController();
	
	this.players = [];
	this.things = [];
};

XboxPadTest.prototype = {
	
	preload: function () {
		// console.log('[XboxPadTest.preload]');
		Kai.load.image('players', '../img/players.png');
		Kai.load.image('bullet', '../img/bullet.png');
		Kai.load.image('tileset', '../img/hex_tiles_b0rked.png');
		
		// crimson land?
	},

	create: function () {
		// console.log('[XboxPadTest.create]');
		Kai.pads.onConnect.add(this.padAdded, this);
		Kai.pads.onDisconnect.add(this.padRemoved, this);
		
		World.set({
			width: 2000,
			height: 2000,
			friction: 0.9,
			gravity: 0
		});
		World.broadphase = new Grid(150);
		
		var canvas = document.getElementById('stage');
		canvas.width = Kai.width = window.innerWidth;
		canvas.height = Kai.height = window.innerHeight;
		
		Kai.stage = new createjs.Stage(canvas);
		
		for (var i = 0; i < 4; i++) {
			this.players[i] = new Player(100 * i + 200, 100 * i + 200, i);
		}
		
		Kai.renderHook = this.draw.bind(this);
		
		// DEBUG
		var debugCanvas = document.getElementById('debug');
		Kai.debugCtx = debugCanvas.getContext('2d');
		DOMTools.copySpatial(canvas, debugCanvas);
		// END DEBUG
		
		console.log('[XboxPadTest.create] Running');
	},
	
	padAdded: function(pad) {
		this.players[pad.id].activate(100 * pad.id + 200, 100 * pad.id + 200);
		console.log('[XboxPadTest.padRemoved] Player '+(pad.id+1)+' joined');
	},
	
	padRemoved: function(pad) {
		this.players[pad.id].disable();
		console.log('[XboxPadTest.padRemoved] Player '+(pad.id+1)+' left');
	},
	
	update: function () {
		Kai.debugCtx.clearRect(0, 0, Kai.width, Kai.height);
		Kai.pads.update();
		
		World.broadphase.update();
		// World.map.update();
	},
	
	draw: function () {
		Kai.stage.update();
	},
	
	dispose: function() {
		Kai.pads.onConnect.remove(this.padAdded, this);
		Kai.pads.onDisconnect.remove(this.padRemoved, this);
		Kai.pads.dispose();
		for (var i = 0; i < this.things.length; i++) {
			this.things[i].dispose();
		}
		this.things = null;
	}
};

return XboxPadTest;

});