define(function(require) {

// imports
var Kai = require('core/Kai');
var World = require('entities/World');
var Grid = require('physics/CollisionGrid');
var DOMTools = require('utils/DOMTools');
var MathTools = require('math/MathTools');
var DebugDraw = require('utils/DebugDraw');
var Rectangle = require('math/Rectangle');

var Camera = require('entities/Camera2');
var LocalPlayManager = require('utils/LocalPlayManager');


var DemoArenaShooter = function() {
	this.playManager = null;
	
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
		console.log('[DemoArenaShooter.create]');
		
		var canvas = document.getElementById('stage');
		canvas.width = Kai.width;
		canvas.height = Kai.height;
		
		// game world
		World.set({
			width: Kai.width * 3,
			height: Kai.height * 3,
			friction: 0.9,
			gravity: 0
		});
		
		World.broadphase = new Grid(150);
		
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
		
		this.playManager = new LocalPlayManager();
		
		World.camera = new Camera({
			displayObject: Kai.stage,
			scalable: true,
			minScale: 0.5,
			scalePadding: 200,
			bounds: null
		});
		
		World.camera.follow(this.playManager.players, Camera.FOLLOW_LOCKON);
		
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
	
	update: function () {
		this.playManager.update();
		World.broadphase.update();
		World.camera.update();
		// World.map.update();
	},
	
	draw: function () {
		Kai.stage.update();
	},
	
	dispose: function() {
		
	}
};

return DemoArenaShooter;

});