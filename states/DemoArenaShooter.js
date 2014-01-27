define(function(require) {

// imports
var Kai = require('core/Kai');
var World = require('entities/World');
var Grid = require('physics/CollisionGrid');
var GamepadController = require('components/input/GamepadController');
var DOMTools = require('utils/DOMTools');
var MathTools = require('math/MathTools');
var DebugDraw = require('utils/DebugDraw');

var Camera = require('entities/Camera2');
var Player = require('entities/GamepadPlayer');
var LocalPlayManager = require('utils/LocalPlayManager');


var DemoArenaShooter = function() {
	this.playManager = null;
	this.players = [];
};

DemoArenaShooter.prototype = {
	
	preload: function () {
		console.log('[DemoArenaShooter.preload]');
		Kai.load.image('players', '../img/players.png');
		Kai.load.image('bullet', '../img/bullet.png');
		Kai.load.image('tileset', '../img/hex_tiles_b0rked.png');
		Kai.load.image('minions', '../img/minions.png');
		
		// crimson land?
	},

	create: function () {
		// console.log('[DemoArenaShooter.create]');
		Kai.pads = new GamepadController();
		Kai.pads.onConnect.add(this.padAdded, this);
		Kai.pads.onDisconnect.add(this.padRemoved, this);
		
		// game world
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
		
		// "tilemap"
		var i, x = 0, y = 0,
			tileWidth = 248, tileHeight = 192;
		
		this.widthInTiles = Math.floor(World.width / tileWidth) + 1;
		this.heightInTiles = Math.floor(World.height / tileHeight) + 1;
		this.numTiles = this.widthInTiles * this.heightInTiles;
		
		var tile, bgLayer = new createjs.Container();
		for (i = 0; i < this.numTiles; i++) {
			tile = new createjs.Bitmap(Kai.cache.getImage('tileset'));
			tile.x = x * tileWidth;
			tile.y = y * tileHeight;
			tile.sourceRect = new createjs.Rectangle(/*MathTools.randomInt(0, 4)*tileWidth*/0, 0, tileWidth, tileHeight)
			
			bgLayer.addChild(tile);
			
			x++;
			if (x === this.widthInTiles) {
				x = 0;
				y++;
			}
		}
		Kai.stage.addChild(bgLayer);
		
		// game logic
		this.playManager = new LocalPlayManager();
		
		for (i = 0; i < 4; i++) {
			this.players[i] = new Player(100 * i + 200, 100 * i + 200, i);
		}
		
		this.camera = new Camera({
			displayObject: Kai.stage
		});
		this.camera.follow(this.players[0].position);
		
		// set manager up with the entities that hold health components
		// this.playManager.trackEntities(this.players);
		
		Kai.renderHook = this.draw.bind(this);
		
		// DEBUG
		var debugCanvas = document.getElementById('debug');
		Kai.debugCtx = debugCanvas.getContext('2d');
		DOMTools.copySpatial(canvas, debugCanvas);
		// END DEBUG
		
		console.log('[DemoArenaShooter.create] Running');
	},
	
	padAdded: function(pad) {
		this.players[pad.id].activate(100 * pad.id + 200, 100 * pad.id + 200);
		console.log('[DemoArenaShooter.padAdded] Player '+(pad.id+1)+' joined');
	},
	
	padRemoved: function(pad) {
		this.players[pad.id].disable();
		console.log('[DemoArenaShooter.padRemoved] Player '+(pad.id+1)+' left');
	},
	
	update: function () {
		if (!Kai.inputBlocked) {
			Kai.pads.update();
		}
		
		World.broadphase.update();
		this.camera.update();
		// World.map.update();
	},
	
	draw: function () {
		Kai.stage.update();
	},
	
	dispose: function() {
		Kai.pads.dispose();
		
		for (var i = 0; i < this.things.length; i++) {
			this.players[i].dispose();
		}
		this.players.length = 0;
	}
};

return DemoArenaShooter;

});