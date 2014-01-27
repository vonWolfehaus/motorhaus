/**
 * Class description
 */
define(function(require) {
	
// imports
var Tools = require('utils/Tools');

// constructor
var ComponentThing = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// attributes
	this.foo = 1;
	
	// attribute override
	Tools.merge(this, settings);
	
	// private properties
	this.entity = entity;
	
	// prerequisite components
	this.position = entity.position;
};

// required statics for component system
ComponentThing.accessor = 'thing'; // property name as it sits on an entity
ComponentThing.className = 'THING_COMPONENT'; // name of component on the ComponenDef object
ComponentThing.priority = 10; // general position in the engine's component array; highest updated first


ComponentThing.prototype = {
	constructor: ComponentThing,
	
	activate: function() {
		this.active = true;
	},
	
	disable: function() {
		this.active = false;
	},
	
	update: function() {
		
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// null references
		this.entity = null;
		this.position = null;
	}
};

return ComponentThing;

});