/*
	DEPRECATED in favor of von-physics
	Scans the collision grid using `getNeighbors` so it finds nearest entity (any entity).
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
mh.GridTargeter = function(entity, settings) {
	settings = settings || {};
	mh.Base.call(this);

	// attributes
	this.searchInterval = 1000;
	this.scanRadius = 400;
	this.collisionId = entity.collisionId;
	this.target = null;

	// attribute override
	mh.util.overwrite(this, settings);

	// private properties
	this.entity = entity;
	this._nearby = new mh.LinkedList();
	this._grid = mh.world.broadphase;
	this._timer = 0;

	// prerequisite components
	this.position = entity.position;
};

// required statics for component system
mh.GridTargeter.accessor = 'gridTargeter'; // property name as it sits on an entity
mh.GridTargeter.className = 'GRID_TARGETER'; // name of component on the ComponenDef object
mh.GridTargeter.priority = 10; // general position in the engine's component array; highest updated first

mh.GridTargeter.prototype = {
	constructor: mh.GridTargeter,

	activate: function() {
		this.active = true;
		this.target = null;
		this.collisionId = this.entity.collisionId;
		this._findTarget();
	},

	disable: function() {
		this.active = false;
		this.target = null;
	},

	update: function() {
		if (performance.now() - this._timer >= this.searchInterval) {
			this._findTarget();
			this._timer = performance.now();
		}
	},

	dispose: function() {
		// remove signal callbacks

		// null references
		this.entity = null;
		this.position = null;
	},

	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/

	_findTarget: function() {
		var node, obj;
		this._nearby.clear();
		this._grid.getNearby(this.position, this.scanRadius, this._nearby);

		node = this._nearby.first;
		while (node) {
			obj = node.obj;
			if (obj && obj.entity.id !== this.entity.id) {
				this.target = obj;
				return;
			}
			node = node.next;
		}
		this.target = null;
	}
};
