/*
	Simple array 2D TileMap. Collision is done by adding/removing collider components to the system at grid positions that have less than 3 neighbors.

	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
mh.TileMap2 = function(tileSize, tilesprite) {
	this.widthInTiles = Math.floor(mh.kai.width / tileSize) + 1;
	this.heightInTiles = Math.floor(mh.kai.height / tileSize) + 1;

	this.numTiles = this.widthInTiles * this.heightInTiles;
	this.grid = [];

	// internal
	this._blockCache = new mh.LinkedList(),
	this._blockLookup = {},
	this._ctx = null,
	this._sizeMulti = 1 / tileSize;
	this.tileSize = tileSize;
	this.tilesprite = tilesprite;

	/*var canvas = document.getElementById('tilemap');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	this._ctx = canvas.getContext('2d');

	for (var i = 0; i < _self.numTiles; i++) {
		_self.grid[i] = 0;
	}

	mh.kai.map = _self;

	console.log('[TileMap2] '+_self.widthInTiles+'x'+_self.heightInTiles);
	// console.log(_self.toString());*/
};

mh.TileMap2.prototype = {
	constuctor: mh.TileMap2,
	/**
	 * Add or remove a tile at the given pixel coordinates.
	 * @returns [boolean] If a tile was changed.
	 */
	setTile: function(x, y, forceValue) {
		var idx, tile, block, px, py;

		forceValue = forceValue || null;
		x = ~~(x * this._sizeMulti);
		y = ~~(y * this._sizeMulti);
		idx = (x * this.heightInTiles) + y;
		if (idx < 0 || idx >= this.numTiles) return false;

		px = x * this.tileSize;
		py = y * this.tileSize;
		tile = this.grid[idx];
		if (forceValue && tile === forceValue) return false;
		// console.log('[TileMap2.setTile] '+x+', '+y+'; '+tile);

		if (tile > 0) {
			this.grid[idx] = 0;
			this._ctx.clearRect(px, py, this.tileSize, this.tileSize);

			// kill the block
			block = this._blockLookup[px+'-'+py];
			this._blockCache.add(block);
			block.disable();
			delete this._blockLookup[px+'-'+py];

		}
		else {
			this.grid[idx] = 1;
			this._ctx.drawImage(this.tilesprite, px, py);

			// add a block to the grid
			if (this._blockCache.length) {
				block = this._blockCache.pop();
				block.position.x = px+25;
				block.position.y = py+25;
			}
			else {
				block = new mh.Block(px+25, py+25);
				block.collider.setMass(0);
			}

			block.enable();
			this._blockLookup[px+'-'+py] = block;
		}

		// console.log(this.toString());
		return true;
	},

	getTile: function(x, y) {
		var idx;
		x = ~~(x * this._sizeMulti);
		y = ~~(y * this._sizeMulti);
		idx = (x * this.heightInTiles) + y;
		if (idx < 0 || idx >= this.numTiles) return null;

		return this.grid[idx];
	},

	clear: function() {
		var block;
		for (var id in this._blockLookup) {
			var str = id.split('-');
			var x = ~~(parseInt(str[0], 10) * this._sizeMulti);
			var y = ~~(parseInt(str[1], 10) * this._sizeMulti);
			var idx = (x * this.heightInTiles) + y;

			this.grid[idx] = 0;
			block = this._blockLookup[id];
			this._ctx.clearRect(block.position.x-25, block.position.y-25, this.tileSize, this.tileSize);

			this._blockCache.add(block);
			block.disable();
			delete this._blockLookup[id];
		}
	},

	toString: function() {
		var str = '', x = 0, y = 0,
			i, v;

		for (i = 0; i < this.numTiles; i++) {
			v = this.grid[~~((x * this.heightInTiles) + y)];

			if (v > 9 && v < 100) str += v + ',';
			else str += ' ' + v + ',';

			if (++x === this.widthInTiles) {
				x = 0;
				y++;
				str += '\n';
			}
		}
		str = str.substring(0, str.length-2); // get rid of the trailing comma because i'm ocd or something
		return str;
	}
};
