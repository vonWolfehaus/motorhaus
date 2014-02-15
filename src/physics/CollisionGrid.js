define(function(require) {

var Kai = require('core/Kai');
var World = require('entities/World');
var Physics = require('physics/Physics2');

/**
 * I'll update this to the new format later. Good god look at all those private variables D:
 */
return function CollisionGrid(cellSize) {
	
	this.cellPixelSize = cellSize;
	
	this.widthInCells = Math.floor(World.width / cellSize) + 1;
	this.heightInCells = Math.floor(World.height / cellSize) + 1;
	
	this.numCells = this.widthInCells * this.heightInCells;
	
	var _self = this, _nearbyList = new LinkedList(),
		_cells = [], _lengths = [],
		_itemList = new LinkedList(), // ALL THE THINGS
		_sizeMulti = 1 / this.cellPixelSize;
	
	// scratch objects
	var _normal = new Vec2(),
		_rv = new Vec2(),
		_impulse = new Vec2(),
		_mtd = new Vec2(),
		_difference = new Vec2();
	
	// this is as naive a broadphase as you can get, so plenty of room to optimize!
	this.update = function() {
		var i, cell, cellPos, cellNode, m, node, item, other;
		var x, y, minX, minY, maxX, maxY, gridRadius;
			
		for (i = 0; i < this.numCells; i++) {
			_cells[i].clear();
		}
		// TODO: node objects need to be body components, not entities!
		node = _itemList.first;
		while (node) {
			item = node.obj;
			if (!item.solid) {
				node = node.next;
				continue;
			}
			
			gridRadius = Math.ceil(item.radius * _sizeMulti);
			itemX = ~~(item.position.x * _sizeMulti);
			itemY = ~~(item.position.y * _sizeMulti);
			
			// in our case it will grab a 3x3 section of the grid, which is unnecessary (should only get 2x2 based on quadrant) but it works
			minX = itemX - gridRadius;
			if (minX < 0) minX = 0;
			minY = itemY - gridRadius;
			if (minY < 0) minY = 0;
			maxX = itemX + gridRadius;
			if (maxX > this.widthInCells) maxX = this.widthInCells;
			maxY = itemY + gridRadius;
			if (maxY > this.heightInCells) maxY = this.heightInCells;
			
			for (x = minX; x <= maxX; x++) {
				for (y = minY; y <= maxY; y++) {
					cellPos = (x * this.heightInCells) + y;
					cell = _cells[cellPos];
					if (!cell) continue;
					
					cellNode = cell.first;
					while (cellNode) {
						other = cellNode.obj;
						if (!other.solid || other.collisionId === item.collisionId) {
							cellNode = cellNode.next;
							continue;
						}
						
						m = Physics.separateCircleVsCircle(item, other);
						if (m) {
							Physics.resolve(item, other, m);
							item.onCollision.dispatch(other, m);
							other.onCollision.dispatch(item, m);
						}
						
						cellNode = cellNode.next;
					}
					
					_cells[cellPos].add(item);
				}
			}
			
			node = node.next;
		}
	};
	
	this.draw = function(offsetX, offsetY) {
		var i, j, node,
			ctx = Kai.debugCtx;
		
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
		
		for (i = 0; i < this.widthInCells; i++) {
			for (j = 0; j < this.heightInCells; j++) {
				ctx.strokeRect((i*this.cellPixelSize)+offsetX, (j*this.cellPixelSize)+offsetY, this.cellPixelSize, this.cellPixelSize);
			}
		}
		
		node = _itemList.first;
		while (node) {
			node.obj.debugDraw(ctx);
			node = node.next;
		}
	};
	
	this.add = function(obj) {
		_itemList.add(obj);
	};
	
	this.remove = function(obj) {
		_itemList.remove(obj);
	};
	
	this.getNeighbors = function(body, pixelRadius, list) {
		var x, y, dx, dy, cell, node, other, cellPos, minX, minY, maxX, maxY,
			influence = pixelRadius * pixelRadius,
			gridRadius = Math.ceil(pixelRadius * _sizeMulti),
			pos = body.position,
			itemX = ~~(pos.x * _sizeMulti),
			itemY = ~~(pos.y * _sizeMulti);
		
		// return _itemList;
		
		if (!list) {
			list = _nearbyList;
		}
		list.clear();
		
		// enforce grid boundaries:
		minX = itemX - gridRadius;
		if (minX < 0) minX = 0;
		minY = itemY - gridRadius;
		if (minY < 0) minY = 0;
		maxX = itemX + gridRadius;
		if (maxX > this.widthInCells) maxX = this.widthInCells;
		maxY = itemY + gridRadius;
		if (maxY > this.heightInCells) maxY = this.heightInCells;
		
		// console.log('gridRadius: '+gridRadius+': '+minX+'-'+maxX+', '+minY+'-'+maxY);
		
		for (x = minX; x <= maxX; x++) {
			for (y = minY; y <= maxY; y++) {
				cellPos = (x * this.heightInCells) + y;
				cell = _cells[cellPos];
				if (!cell) continue;
				
				node = cell.first;
				while (node) {
					other = node.obj;
					if (!other.solid || other.collisionId === body.collisionId) {
						node = node.next;
						continue;
					}
					
					dx = pos.x - other.position.x;
					dy = pos.y - other.position.y;
					
					if ((dx * dx) + (dy * dy) <= influence) {
						list.add(other);
					}
					
					node = node.next;
				}
			}
		}
		
		return list;
	};
	
	// does NOT clear the list for you; this is so we can build up a single list for multiple areas
	this.getNearby = function(pos, pixelRadius, list) {
		var x, y, dx, dy, cell, node, other, cellPos, minX, minY, maxX, maxY,
			influence = pixelRadius * pixelRadius,
			gridRadius = Math.ceil(pixelRadius * _sizeMulti),
			itemX = ~~(pos.x * _sizeMulti),
			itemY = ~~(pos.y * _sizeMulti);
		
		if (!list) {
			_nearbyList.clear();
			list = _nearbyList;
		}
		
		// enforce grid boundaries:
		minX = itemX - gridRadius;
		if (minX < 0) minX = 0;
		minY = itemY - gridRadius;
		if (minY < 0) minY = 0;
		maxX = itemX + gridRadius;
		if (maxX > this.widthInCells) maxX = this.widthInCells;
		maxY = itemY + gridRadius;
		if (maxY > this.heightInCells) maxY = this.heightInCells;
		
		// console.log('gridRadius: '+gridRadius+': '+minX+'-'+maxX+', '+minY+'-'+maxY);
		
		for (x = minX; x <= maxX; x++) {
			for (y = minY; y <= maxY; y++) {
				cellPos = (x * this.heightInCells) + y;
				cell = _cells[cellPos];
				if (!cell) continue;
				
				node = cell.first;
				while (node) {
					other = node.obj;
					dx = pos.x - other.position.x;
					dy = pos.y - other.position.y;
					
					if ((dx * dx) + (dy * dy) <= influence) {
						list.add(other);
					}
					
					node = node.next;
				}
			}
		}
		
		return list;
	};
	
	this.log = function() {
		console.log('Cells: '+_cells.length);
	};
	
	
	init();
	function init() {
		var i, j;
		// console.log(_cells);
		for (i = 0; i < _self.numCells; i++) {
			_cells[i] = new LinkedList();
		}
		// console.log(_cells);
		
		console.log('[CollisionGrid] '+_self.widthInCells+'x'+_self.heightInCells+': '+_self.numCells+' cells');
	}
		
} // class
});