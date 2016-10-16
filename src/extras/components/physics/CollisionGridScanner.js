/*
	DEPRECATED in favor of von-physics
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
mh.CollisionGridScanner = function(entity, settings) {
	settings = settings || {};
	mh.Base.call(this);

	// attributes
	this.scanRadius = 1;

	// attribute override
	mh.util.overwrite(this, settings);

	this.onCollision = new mh.Signal();

	// mh.kai.expect(entity, 'body', mh.RadialCollider);

	// private properties
	this.entity = entity;
	this._body = entity.body;
	this._nearby = new mh.LinkedList();
	this._grid = mh.world.broadphase;
};

// required statics for component system
mh.CollisionGridScanner.accessor = 'collisionScanner'; // property name as it sits on an entity
mh.CollisionGridScanner.className = 'COLLISION_SCANNER_RADIAL'; // name of component on the ComponenDef object
mh.CollisionGridScanner.priority = 5; // general position in the engine's component array; highest updated first

mh.CollisionGridScanner.prototype = {
	constructor: mh.CollisionGridScanner,

	activate: function() {
		this.active = true;
	},

	disable: function() {
		this.active = false;
	},

	update: function() {
		var node, obj;
		this._grid.getNeighbors(this._body, this.scanRadius, this._nearby);

		node = this._nearby.first;
		while (node) {
			obj = node.obj;

			// only tests! if you physics resolution, then just put it in the grid
			if (mh.physics.testCircleVsCircle(obj, this._body)) {
				this.onCollision.dispatch(obj);
				break;
			}
			node = node.next;
		}
	},

	dispose: function() {
		// remove signal callbacks
		this.onCollision.dispose();

		// null references
		this.entity = null;
		this.position = null;
		this.onCollision = null;
	}
};
