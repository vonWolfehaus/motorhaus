/**
 * Class description
 */
define(function(require) {

// imports
var World = require('core/World');
var mh.util = require('utils/mh.util');

// constructor
var GridTargeter = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);

	// attributes
	this.searchInterval = 1000;
	this.scanRadius = 400;
	this.collisionId = entity.collisionId;
	this.target = null;

	// attribute override
	mh.util.merge(this, settings);

	// private properties
	this.entity = entity;
	this._nearby = new LinkedList();
	this._grid = World.broadphase;
	this._timer = 0;

	// prerequisite components
	this.position = entity.position;
};

// required statics for component system
GridTargeter.accessor = 'gridTargeter'; // property name as it sits on an entity
GridTargeter.className = 'GRID_TARGETER'; // name of component on the ComponenDef object
GridTargeter.priority = 10; // general position in the engine's component array; highest updated first


GridTargeter.prototype = {
	constructor: GridTargeter,

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
		var node, obj, m;
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

return GridTargeter;

});