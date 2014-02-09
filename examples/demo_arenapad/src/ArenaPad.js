define(function(require) {

// imports
var Kai = require('core/Kai');
var Camera = require('core/Camera2');
var World = require('entities/World');
var Grid = require('physics/CollisionGrid');
var DOMTools = require('utils/DOMTools');
var MathTools = require('math/MathTools');
var DebugDraw = require('utils/DebugDraw');
var Rectangle = require('math/Rectangle');

var LocalPlayManager = require('arena/LocalPlayManager');
var Scoreboard = require('arena/Scoreboard');
var PlayerScoreUI = require('arena/PlayerScoreUI');
var PointPlate = require('arena/entities/PointPlate');


var ArenaPad = function() {
	this.playManager = null;
	
};

ArenaPad.prototype = {
	
	preload: function () {
		console.log('[ArenaPad.preload]');
		Kai.load.image('players', 'img/players.png');
		Kai.load.image('bullet', 'img/bullet.png');
		Kai.load.image('tileset', 'img/hex_tiles_b0rked.png');
		Kai.load.image('pointplate', 'img/point_plate.png');
		Kai.load.image('minions', 'img/minions.png');
		
		// crimson land?
	},

	create: function () {
		console.log('[ArenaPad.create]');
		
		var canvas = document.getElementById('stage');
		canvas.width = Kai.width;
		canvas.height = Kai.height;
		
		// game world
		World.set({
			width: Kai.width * 2,
			height: Kai.height * 2,
			friction: 0.9,
			gravity: 0
		});
		
		World.broadphase = new Grid(150);
		
		Kai.stage = new createjs.Stage(canvas);
		
		// "tilemap", just the background
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
		
		// point plates
		var numPlates = 4, radius = World.width / 2 - 200,
			o, tau = Math.PI * 2,
			a = 0, ao = tau / numPlates;
		for (i = 0; i < numPlates; i++) {
			o = new PointPlate(Math.cos(a) * radius + (World.width / 2), Math.sin(a) * radius + (World.height / 2));
			a += ao;
		}
		o = new PointPlate(World.width / 2, World.height / 2);
		
		this.playManager = new LocalPlayManager(4);
		this.scoreboard = new Scoreboard(4);
		
		this.ui = new PlayerScoreUI();
		
		World.camera = new Camera({
			displayObject: Kai.stage,
			scalable: true,
			minScale: 0.5,
			scalePadding: World.width / 4,
			bounds: null
		});
		
		World.camera.follow(this.playManager.players, Camera.FOLLOW_LOCKON);
		
		Kai.renderHook = this.draw.bind(this);
		
		// DEBUG
		var debugCanvas = document.getElementById('debug');
		Kai.debugCtx = debugCanvas.getContext('2d');
		DOMTools.copySpatial(canvas, debugCanvas);
		// END DEBUG
		
		
		
		// game management
		/*Kai.addComponent(this, ComponentType.TIMER, {
			interval: 3000,
			repeat: 0
		});
		this.timer.onInterval.add(this._resetGame, this);*/
		
		console.log('[ArenaPad.create] Running');
	},
	
	update: function () {
		this.playManager.update();
		World.broadphase.update();
		World.camera.update();
		// World.map.update();
	},
	
	draw: function () {
		Kai.stage.update();
		// World.broadphase.draw(Kai.debugCtx, -World.camera.position.x, -World.camera.position.y);
	},
	
	dispose: function() {
		
	}
};

return ArenaPad;

});