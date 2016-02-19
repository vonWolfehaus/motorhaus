define(function(require) {

// imports
var mh.util = require('utils/mh.util');
var World = require('core/World');
var Physics = require('physics/Physics2');

// constructor
var CollisionGridScanner = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);

	// attributes
	this.scanRadius = 1;

	// attribute override
	mh.util.merge(this, settings);
	// mh.util.testForRequired(entity, ['body']);

	this.onCollision = new Signal();

	// private properties
	this.entity = entity;
	this._body = entity.body;
	this._nearby = new LinkedList();
	this._grid = World.broadphase;
};

// required statics for component system
CollisionGridScanner.accessor = 'collisionScanner'; // property name as it sits on an entity
CollisionGridScanner.className = 'COLLISION_SCANNER_RADIAL'; // name of component on the ComponenDef object
CollisionGridScanner.priority = 5; // general position in the engine's component array; highest updated first


CollisionGridScanner.prototype = {
	constructor: CollisionGridScanner,

	activate: function() {
		this.active = true;
	},

	disable: function() {
		this.active = false;
	},

	update: function() {
		var node, obj, m;
		this._grid.getNeighbors(this._body, this.scanRadius, this._nearby);

		node = this._nearby.first;
		while (node) {
			obj = node.obj;

			// only tests! if you physics resolution, then just put it in the grid
			if (Physics.testCircleVsCircle(obj, this._body)) {
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

return CollisionGridScanner;

});