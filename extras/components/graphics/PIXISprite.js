/**
 * Class description
 */
define(function(require) {
	
// imports
var Tools = require('utils/Tools');

// constructor
var PIXISprite = function(entity, settings) {
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
PIXISprite.accessor = 'view'; // property name as it sits on an entity
PIXISprite.className = 'VIEW_PIXI_SPRITE'; // name of component on the ComponenDef object
PIXISprite.priority = 10; // general position in the engine's component array; highest updated first


PIXISprite.prototype = {
	constructor: PIXISprite,
	
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

return PIXISprite;

});