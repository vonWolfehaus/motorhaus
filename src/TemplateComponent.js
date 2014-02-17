/**
 * Class description
 */
define(function(require) {
	
// imports
var Kai = require('core/Kai');
var Tools = require('utils/Tools');

// constructor
var ComponentThing = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// public properties
	this.foo = 1;
	
	// attribute override
	Tools.merge(this, settings);
	
	// other properties
	this.entity = entity;
	
	// prerequisite components
	this.position = Kai.expect(entity, 'position', Vec2);
};

// required statics for component system
ComponentThing.accessor = 'thing'; // property name as it sits on an entity
ComponentThing.className = 'THING_COMPONENT'; // name of component on the component definition object
ComponentThing.priority = 10; // general position in the engine's component array; the lower, the earlier it's updated
ComponentThing.post = false; // whether or not this component will have a postUpdate() called on it


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