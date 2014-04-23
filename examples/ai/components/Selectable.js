/**
 * Class description
 */
define(function(require) {
	
// imports
var Kai = require('core/Kai');
var Tools = require('utils/Tools');
var DebugDraw = require('utils/DebugDraw');

// constructor
var Selectable = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// public properties
	this.on = true;
	this.outlineRadius = 50;
	this.id = 0;
	
	// attribute override
	Tools.merge(this, settings);
	
	// other properties
	this.entity = entity;
	
	// prerequisite components
	this.position = Kai.expect(entity, 'position', Vec2);
};

// required statics for component system
Selectable.accessor = 'selector'; // property name as it sits on an entity
Selectable.className = 'SELECTOR'; // name of component on the component definition object
Selectable.priority = 200; // general position in the engine's component array; updated in ascending order
Selectable.post = false; // whether or not this component will have a postUpdate() called on it


Selectable.prototype = {
	constructor: Selectable,
	
	activate: function() {
		// console.log('selected '+this.entity.uniqueId+' of team '+this.entity.team);
		this.active = true;
	},
	
	disable: function() {
		this.active = false;
	},
	
	update: function() {
		DebugDraw.circle(Kai.debugCtx, this.position.x, this.position.y, this.outlineRadius, 'rgb(200, 200, 30)');
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// null references
		this.entity = null;
		this.position = null;
	}
};

return Selectable;

});