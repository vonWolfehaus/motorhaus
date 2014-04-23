define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentType = require('components/VonComponents');
var MathTools = require('math/MathTools');
var World = require('core/World');
var BoidGroup = require('entities/BoidGroup');
var DualPool = require('utils/DualPool');
var DebugDraw = require('utils/DebugDraw');

/*
	Represents a player and their mouse in the context of selecting and ordering around AI game entities.
	Only interacts with entities that have the Selector component.
*/
var Commander = function(playerID) {
	require('core/Base').call(this);
	
	this.team = playerID || 0;
	this.startPosition = new Vec2();
	this.currentPosition = Kai.mouse.position;
	this.driftForgiveness = 30; // number of pixels we will let the mouse move before we say a click is an area selection
	
	this._selection = new LinkedList();
	this._tempSelection = new LinkedList();
	this._groupPool = new DualPool(BoidGroup);
	this._currentGroup = null;
	
	Kai.addComponent(this, ComponentType.STACK_FSM);
	
	Kai.mouse.onDown.add(this._mouseDown, this);
	Kai.mouse.onUp.add(this._mouseUp, this);
};

Commander.prototype = {
	constructor: Commander,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function() {
		this.active = true;
	},
	
	disable: function() {
		this.active = false;
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// dispose components
		Kai.removeComponent(this, ComponentType.BODY_AABB2);
		
		// null references
		this.position = null;
		this.velocity = null;
	},
	
	/*-------------------------------------------------------------------------------
									BEHAVIORS: called every tick by StackFSM
	-------------------------------------------------------------------------------*/
	
	selecting: function selecting() {
		var dist = this.startPosition.distanceTo(this.currentPosition);
		if (dist > this.driftForgiveness) {
			DebugDraw.circle(Kai.debugCtx, this.startPosition.x, this.startPosition.y, dist, 'rgb(200, 200, 30)');
		}
		// TODO: draw selection cursor
	},
	
	commanding: function commanding() {
		// TODO: draw selection cursor
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_mouseDown: function(pos) {
		this.startPosition.copy(pos);
		this.stackFSM.pushState(this.selecting, this);
	},
	
	_mouseUp: function(pos) {
		var ent, node;
		var dist = this.startPosition.distanceTo(this.currentPosition);
		
		this.stackFSM.popState();
		
		this._tempSelection.clear();
		// commented out rectangular selection method
		/*if (dist < this.driftForgiveness) {
			// this is a bad cheat--you should check broadphase for anything directly under the mouse (not implemented in current broadphase)
			World.broadphase.getNearby(this.startPosition, this.driftForgiveness, this._tempSelection);
		} else {
			World.broadphase.getAllInArea(this.startPosition.x, this.startPosition.y, this.currentPosition.x, this.currentPosition.y, this._tempSelection);
		}*/
		World.broadphase.getNearby(this.startPosition, dist < this.driftForgiveness ? this.driftForgiveness : dist, this._tempSelection);
		
		// double check that these entities are selectable
		node = this._tempSelection.first;
		while (node) {
			// make it a list of entities, not body components (which we got back from broadphase)
			if (node.obj.entity) {
				this._tempSelection.swapObjects(node, node.obj.entity);
			}
			
			ent = node.obj;
			node = node.next;
			if (!ent.selector || !ent.selector.on || ent.selector.id !== this.team) {
				this._tempSelection.remove(ent);
				continue;
			}
		}
		
		// if we didn't draw out a selection area, nor did we directly click on a single entity (ie nothing was selected)..
		if (dist < this.driftForgiveness && this._tempSelection.length === 0) {
			// ..it's likely we want to command the current selection
			this._command();
		} else {
			this._select();
		}
	},
	
	_command: function() {
		if (this._selection.length === 0) return; // nothing to command
		
		if (this._currentGroup) {
			if (!Kai.mouse.shift) {
				// if player has shift down, it's rad to simply add waypoints
				this._currentGroup.reset();
			}
			
		} else {
			group = this._groupPool.get();
			group.reset();
			group.activate(this._selection);
			group.onComplete.addOnce(this._groupReady, this);
			this._currentGroup = group;
		}
		
		group.addWaypoint(this.currentPosition.x, this.currentPosition.y);
	},
	
	_select: function() {
		var node;
		if (Kai.mouse.ctrl) {
			if (this._tempSelection.length === 1) {
				// player wants to remove an entity from selection
				node = this._tempSelection.first;
				this._selection.remove(node.obj);
				node.obj.selector.disable();
				
				// invalidate group--BoidGroup knows when its members leave and dispatches onComplete so it'll be recycled
				this._currentGroup = null;
			}
			
			// ctrl is only used for deselecting a single entity, so do nothing else
			return;
		}
		
		if (!Kai.mouse.shift) {
			// player doesn't want to add to current selection but rather make a completely new one, so clear the list
			node = this._selection.first;
			while (node) {
				node.obj.selector.disable();
				node = node.next;
			}
			this._selection.clear();
		}
		
		// save the new selection
		this._selection.concat(this._tempSelection); // TODO: rename concat on list to something like concatSafe or something
		
		// if the new selection had any units from the old selection, we have to reactivate them
		node = this._selection.first;
		while (node) {
			node.obj.selector.activate();
			node = node.next;
		}
		
		// invalidate group
		this._currentGroup = null;
	},
	
	_groupReady: function(group) {
		this._groupPool.recycle(group);
		if (this._currentGroup && this._currentGroup.uniqueId === group.uniqueId) {
			// done, so next time just use a different group
			this._currentGroup = null;
		}
	}
	
};

return Commander;

});