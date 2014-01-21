define(function(require) {
	
// imports
var Tools = require('utils/Tools');

// constructor
var KAMISprite = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// attributes
	this.foo = 1;
	
	// attribute override
	Tools.merge(this, settings);
	
	// private properties
	this._entity = entity;
	
	// prerequisite components
	this.position = entity.position;
	
	
};

// required statics for component system
KAMISprite.accessor = 'view'; // property name as it sits on an entity
KAMISprite.className = 'KAMISPRITE'; // name of component on the ComponenDef object
KAMISprite.priority = 10; // general position in the engine's component array; highest updated first


KAMISprite.prototype = {
	constructor: KAMISprite,
	
	reset: function() {
		
	},
	
	update: function() {
		
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// null references
		this._entity = null;
		this.position = null;
	}
};

return KAMISprite;

});