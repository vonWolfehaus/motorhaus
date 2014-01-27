define(function(require) {
	
// imports
var Kai = require('core/Kai');
var ComponentType = require('components/ComponentDef');
var MathTools = require('math/MathTools');

// constructor
var LocalPlayManager = function() {
	
	this.scoreboard = [];
	
};


LocalPlayManager.prototype = {
	constructor: LocalPlayManager,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	trackEntities: function(entities) {
		var i, obj;
		for (var i = 0; i < entities.length; i++) {
			obj = entities[i];
			// obj.health.onDeath.add();
			// obj.health.onActivate.add();
		};
		
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// dispose components
		Kai.removeComponent(this, ComponentType.THING);
		
		// null references
		this.position = null;
		this.velocity = null;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_signalCallback: function() {
		
	}
	
};

return LocalPlayManager;

});