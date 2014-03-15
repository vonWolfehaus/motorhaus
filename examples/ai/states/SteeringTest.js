define(function(require) {

// imports
var Kai = require('core/Kai');
var Camera = require('core/Camera2');
var World = require('core/World');
var Grid = require('physics/CollisionGrid');
var DOMTools = require('utils/DOMTools');
var MathTools = require('math/MathTools');
var Rectangle = require('math/Rectangle');


var SteeringTest = function() {
	
};

SteeringTest.prototype = {
	
	preload: function () {
		console.log('[SteeringTest.preload]');
		Kai.load.image('bullet', 'img/bullet.png');
		Kai.load.image('tileset', 'img/hex_tiles_b0rked.png');
		Kai.load.image('minions', 'img/minions.png');
	},

	create: function () {
		console.log('[SteeringTest.create]');
		
		// game world attributes
		World.set({
			width: Kai.width * 2,
			height: Kai.height * 2,
			friction: 0.9,
			gravity: 0
		});
		
		// add collision detection
		World.broadphase = new Grid(150);
		
		var canvas = document.getElementById('stage');
		Kai.stage = new von2d.Stage(Kai.width, Kai.height, canvas);
		
		// "tilemap", just the background
		var i, x = 0, y = 0,
			tileWidth = 248, tileHeight = 192;
		
		this.widthInTiles = Math.floor(World.width / tileWidth) + 1;
		this.heightInTiles = Math.floor(World.height / tileHeight) + 1;
		this.numTiles = this.widthInTiles * this.heightInTiles;
		
		var mainLayer = new von2d.Container();
		
		// add a new global so we can add objects to it
		Kai.layer = mainLayer;
		
		var tile, bgLayer = new von2d.Container();
		
		for (i = 0; i < this.numTiles; i++) {
			tile = new von2d.Sprite(Kai.cache.getImage('tileset'));
			tile.position.x = x * tileWidth;
			tile.position.y = y * tileHeight;
			tile.frame = new Rectangle(/*MathTools.randomInt(0, 4)*tileWidth*/0, 0, tileWidth, tileHeight)
			
			bgLayer.addChild(tile);
			
			x++;
			if (x === this.widthInTiles) {
				x = 0;
				y++;
			}
		}
		
		mainLayer.addChild(bgLayer);
		
		
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
			displayObject: mainLayer,
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
		
		Kai.stage.addChild(mainLayer);
		
		// game management
		/*Kai.addComponent(this, ComponentType.TIMER, {
			interval: 3000,
			repeat: 0
		});
		this.timer.onInterval.add(this._resetGame, this);*/
		
		console.log('[SteeringTest.create] Running');
	},
	
	update: function () {
		this.playManager.update();
		World.broadphase.update();
		World.camera.update();
		// World.map.update();
	},
	
	draw: function () {
		Kai.stage.draw();
		// World.broadphase.draw(Kai.debugCtx, -World.camera.position.x, -World.camera.position.y);
	},
	
	dispose: function() {
		
	}
};

return SteeringTest;

});