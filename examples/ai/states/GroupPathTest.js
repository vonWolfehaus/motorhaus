define(function(require) {

// imports
var Kai = require('core/Kai');
var Camera = require('core/Camera2');
var World = require('core/World');
var Grid = require('physics/CollisionGrid');
var DOMTools = require('utils/DOMTools');
var MathTools = require('math/MathTools');
var DebugDraw = require('utils/DebugDraw');

var Boidy = require('ai/entities/DroneBoidy');
var BoidGroup = require('entities/BoidGroup');


var FollowPathTest = {
	
	_group: new BoidGroup({}),
	
	preload: function () {
		console.log('[FollowPathTest.preload]');
		Kai.load.image('tileset', '../_shared/img/bg_simple.png');
		Kai.load.image('beetle', '../_shared/img/beetle.png');
	},

	create: function () {
		console.log('[FollowPathTest.create]');
		
		// game world attributes that the physics system pulls from
		World.set({
			width: Kai.width,
			height: Kai.height,
			friction: 0.9,
			gravity: 0
		});
		// we have to set broadphase afterwards, otherwise it probably won't see the new width/height values
		World.broadphase = new Grid(200);
		
		var canvas = document.getElementById('stage');
		Kai.stage = new von2d.Stage(Kai.width, Kai.height, canvas);
		
		// "tilemap", just the background
		var i = 0, x = 0, y = 0,
			tileWidth = 200, tileHeight = 200;
		
		this.widthInTiles = Math.floor(World.width / tileWidth) + 1;
		this.heightInTiles = Math.floor(World.height / tileHeight) + 1;
		this.numTiles = this.widthInTiles * this.heightInTiles;
		
		var tile, img = Kai.cache.getImage('tileset'),
			bgLayer = new von2d.Container();
		
		for (i = 0; i < this.numTiles; i++) {
			tile = new von2d.Sprite(img);
			tile.position.x = x * tileWidth;
			tile.position.y = y * tileHeight;
			tile.anchor.reset(0, 0); // top left
			
			bgLayer.addChild(tile);
			
			x++;
			if (x === this.widthInTiles) {
				x = 0;
				y++;
			}
		}
		
		// add a new global so we can add objects to it
		Kai.layer = new von2d.Container();
		Kai.layer.addChild(bgLayer);
		
		Kai.stage.addChild(Kai.layer);
		
		Kai.renderHook = this.draw.bind(this);
		
		this.path = this._group.path;

		// add our dynamic objects
		var aiEntity;
		for (i = 0; i < 6; i++) {
			aiEntity = new Boidy(MathTools.random(50, 300), MathTools.random(50, 300));
			aiEntity.activate();
			this._group.addEntity(aiEntity);
		}
		
		Kai.mouse.onDown.add(this.clicked, this);
		
		// DEBUG
		var debugCanvas = document.getElementById('debug');
		Kai.debugCtx = debugCanvas.getContext('2d');
		DOMTools.copySpatial(canvas, debugCanvas);
		// END DEBUG
		
		console.log('[FollowPathTest.create] Running');
	},
	
	update: function () {
		World.broadphase.update();
		for (var i = 0; i < this.path.length; i++) {
			DebugDraw.point(Kai.debugCtx, this.path[i], null, 'rgb(255, 255, 0)');
			if (this.path[i+1]) {
				DebugDraw.vectorLine(Kai.debugCtx, this.path[i], this.path[i+1], 'rgb(255, 255, 0)');
			}
		}
	},
	
	draw: function () {
		Kai.stage.draw();
		if (this._group.active) {
			DebugDraw.point(Kai.debugCtx, this._group.position, null, 'rgb(0, 0, 0)');
		}
	},
	
	dispose: function() {
		Kai.mouse.onDown.remove(this.clicked, this);
	},
	
	clicked: function(pos) {
		if (!this._group.active) {
			// make sure the group gets updated
			this._group.activate();
		}
		this._group.addWaypoint(pos.x, pos.y);
	}
	
};

return FollowPathTest;

});