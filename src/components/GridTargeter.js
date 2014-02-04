/**
 * Class description
 */
define(function(require) {
	
// imports
var Tools = require('utils/Tools');
var ComponentType = require('components/ComponentDef');

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
	Tools.merge(this, settings);
	
	// private properties
	this.entity = entity;
	this._nearby = new LinkedList();
	
	// prerequisite components
	this.position = entity.position;
	
	// hot component-on-component action
	Kai.addComponent(this, ComponentType.TIMER, {
		interval: this.searchInterval,
		immediateDispatch: true
	});
	
	this.timer.onInterval.add(this._findTarget, this);
};

// required statics for component system
GridTargeter.accessor = 'gridTargeter'; // property name as it sits on an entity
GridTargeter.className = 'GRID_TARGETER'; // name of component on the ComponenDef object
GridTargeter.priority = 10; // general position in the engine's component array; highest updated first


GridTargeter.prototype = {
	constructor: GridTargeter,
	
	activate: function() {
		this.active = false; // event-driven
		this.timer.activate();
	},
	
	disable: function() {
		this.active = false;
		this.timer.disable();
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
		this._grid.getNearby(this.position, this.scanRadius, this._nearby);
		
		node = this._nearby.first;
		while (node) {
			obj = node.obj;
			if (obj && obj.collisionId !== this.collisionId) {
				this._target = obj;
				return;
			}
			node = node.next;
		}
		this._target = null;
	}
};

return GridTargeter;

});