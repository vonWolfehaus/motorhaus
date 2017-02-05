/*
	This is a flow grid (or vector grid) which is a combination of a grid that's generated using the wavefront algorithm, which is then used to build a grid of vectors that literally point to a goal. This provides directions for any entity to the goal point quickly. It is best used in situations where a LOT of entities share a goal, and even better when those entities use steering behaviors, making for a very fluid, natural motion path.

	Flexibility can be added by temporarily "disrupting" the grid with other fields emitted by dynamics obstacles. They would change the vector grid under them (not the grid) and have it return to normal as they move away.

	Optimization is needed. There should be sectors of the grid (or just one larger grid holding multiple FlowGrid instances) that only get rebuilt when needed. This might require another pathfinder like A* in order to determine which sectors need updating, to prevent the wave from propagating outside the needed bounds.

	A good place to improve on this is potential fields: http://aigamedev.com/open/tutorials/potential-fields/

	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
	@source http://gamedev.tutsplus.com/tutorials/implementation/goal-based-vector-field-pathfinding/
*/
mh.FlowGrid = function(cellSize, width, height) {
	this.cellPixelSize = cellSize;

	this.widthInCells = Math.floor(width / cellSize) + 1;
	this.heightInCells = Math.floor(height / cellSize) + 1;

	this.numCells = this.widthInCells * this.heightInCells;

	this.grid = [];

	this.goal = new mh.Vec2();
	this.goalPixels = new mh.Vec2();

	this._openList = new mh.LinkedList();
	this._sizeMulti = 1 / this.cellPixelSize;

	var i, j;
	for (i = 0; i < this.widthInCells; i++) {
		this.grid[i] = [];
		for (j = 0; j < this.heightInCells; j++) {
			this.grid[i][j] = new mh.FlowGridNode(i, j);
		}
	}

	mh.kai.flow = this;

	console.log('[FlowGrid] '+this.widthInCells+'x'+this.heightInCells);
};

mh.FlowGrid.prototype = {
	/**
	 * Coordinates are in world space (pixels).
	 */
	setGoal: function(endPixelX, endPixelY) {
		var endX = ~~(endPixelX * this._sizeMulti);
		var endY = ~~(endPixelY * this._sizeMulti);

		if (endX < 0 || endY < 0 || endX >= this.widthInCells || endY >= this.heightInCells) {
			throw new Error('[FlowGrid.build] Out of bounds');
		}

		if (this.goal.x === endX && this.goal.y === endY) return false;

		this.goal.x = endX;
		this.goal.y = endY;
		this.goalPixels.activate(endPixelX, endPixelY);

		return true;
	},

	/**
	 * Runs a breadth-first search on the heatmap, stores how many steps it took to get to each tile
	 * along the way. Then calculates the movement vectors.
	 */
	build: function() {
		var i, j, current, node, neighbor,
			v, a, b;

		for (i = 0; i < this.widthInCells; i++) {
			for (j = 0; j < this.heightInCells; j++) {
				this.grid[i][j].open = true;
			}
		}

		this._openList.clear();

		node = this.grid[this.goal.x][this.goal.y];
		node.cost = 0;

		this._openList.add(node);

		// front the wave. set fire to the brush. etc.
		while (this._openList.length) {
			node = this._openList.shift();
			node.open = false;

			current = this.grid[node.gridX][node.gridY];

			// left
			neighbor = node.gridX-1 >= 0 ? this.grid[node.gridX-1][node.gridY] : null;
			if (neighbor && neighbor.open && neighbor.passable) {
				neighbor.cost = current.cost + 1;
				neighbor.open = false; // we must set false now, in case a different neighbor gets this as neighbor
				this._openList.add(neighbor);
			}
			// right
			neighbor = this.grid[node.gridX+1] ? this.grid[node.gridX+1][node.gridY] : null;
			if (neighbor && neighbor.open && neighbor.passable) {
				neighbor.cost = current.cost + 1;
				neighbor.open = false;
				this._openList.add(neighbor);
			}
			// up
			neighbor = this.grid[node.gridX][node.gridY-1] || null;
			if (neighbor && neighbor.open && neighbor.passable) {
				neighbor.cost = current.cost + 1;
				neighbor.open = false;
				this._openList.add(neighbor);
			}
			// down
			neighbor = this.grid[node.gridX][node.gridY+1] || null;
			if (neighbor && neighbor.open && neighbor.passable) {
				neighbor.cost = current.cost + 1;
				neighbor.open = false;
				this._openList.add(neighbor);
			}
			// i++; // DEBUG
		}

		// recalculate the vector field
		for (i = 0; i < this.widthInCells; i++) {
			for (j = 0; j < this.heightInCells; j++) {
				v = this.grid[i][j];

				a = i-1 >= 0 && this.grid[i-1][j].passable ? this.grid[i-1][j].cost : v.cost;
				b = i+1 < this.widthInCells && this.grid[i+1][j].passable ? this.grid[i+1][j].cost : v.cost;
				v.x = a - b;

				a = j-1 >= 0 && this.grid[i][j-1].passable ? this.grid[i][j-1].cost : v.cost;
				b = j+1 < this.heightInCells && this.grid[i][j+1].passable ? this.grid[i][j+1].cost : v.cost;
				v.y = a - b;
			}
		}
		// TODO: normalize values

		// console.log('[FlowGrid.regenHeatmap] Completed in '+i+' iterations:');
		// console.log(this.toString());
	},

	draw: function(ctx) {
		var i, j, v, vx, vy;
		ctx.lineWidth = 1;
		for (i = 0; i < this.widthInCells; i++) {
			for (j = 0; j < this.heightInCells; j++) {
				ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
				ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
				v = this.grid[i][j];
				if (!v.passable) continue;

				vx = (i*this.cellPixelSize)+(this.cellPixelSize*0.5);
				vy = (j*this.cellPixelSize)+(this.cellPixelSize*0.5);

				ctx.beginPath();
				ctx.arc(vx, vy, 3, 0, mh.util.TAU, false);
				ctx.fill();
				ctx.moveTo(vx, vy);
				ctx.lineTo(vx+(v.x*11), vy+(v.y*11));
				ctx.stroke();

				// ctx.strokeStyle = 'rgba(120, 0, 0, 0.5)';
				// ctx.strokeRect(i*this.cellPixelSize, j*this.cellPixelSize, this.cellPixelSize, this.cellPixelSize);
			}
		}
	},

	/**
	 * Given the pixel coordinates, return the Vec2 associated with that position.
	 */
	getVectorAt: function(pos) {
		var x = ~~(pos.x * this._sizeMulti);
		var y = ~~(pos.y * this._sizeMulti);
		if (this.grid[x] && this.grid[x][y]) {
			return this.grid[x][y];
		}
		return null;
	},

	/**
	 * Flips the flow switch at the provided pixel coordinates, so it will either become passable, or not.
	 */
	setBlockAt: function(x, y) {
		x = ~~(x * this._sizeMulti);
		y = ~~(y * this._sizeMulti);
		this.grid[x][y].passable = !this.grid[x][y].passable;
		this.grid[x][y].cost = -1;

		this.build();

		return !this.grid[x][y].passable;
	},

	clear: function() {
		var i, j, v;
		for (i = 0; i < this.widthInCells; i++) {
			for (j = 0; j < this.heightInCells; j++) {
				v = this.grid[i][j];
				v.passable = true;
				v.cost = -1;
			}
		}
		this.build();
	},

	toString: function() {
		var str = '', x = 0, y = 0,
			i, v;

		for (i = 0; i < this.numCells; i++) {
			v = this.grid[x][y].cost;

			if (v > 99) str += v + ',';
			else if (v > 9 && v < 100) str += ' ' + v + ',';
			else str += '  ' + v + ',';

			if (++x === this.widthInCells) {
				x = 0;
				y++;
				str += '\n';
			}
		}
		str = str.substring(0, str.length-2); // get rid of the trailing comma because i'm ocd or something
		return str;
	},

	log: function() {
		console.log(this.toString());
	}
};

mh.FlowGridNode = function(gx, gy) {
	// velocity
	this.x = 0;
	this.y = 0;

	this.gridX = gx;
	this.gridY = gy;

	// heat value
	this.cost = 0;
	this.open = true;
	this.passable = true;

	this.uniqueID = Date.now() + '' + Math.floor(Math.random()*1000);
};
