define(function(require) {
	
// imports
var Kai = require('core/Kai');
var Tools = require('utils/Tools');

// constructor
var EASELBitmap = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// attributes
	this.image = null;
	this.width = 0;
	this.height = 0;
	
	// attribute override
	Tools.merge(this, settings);
	
	// private properties
	this.entity = entity;
	this._display = new createjs.Bitmap(this.image);
	
	// prerequisite components
	this.position = entity.position;
	this.rotation = entity.rotation;
	
	Kai.stage.addChild(this._display);
};

// required statics for component system
EASELBitmap.accessor = 'view'; // property name as it sits on an entity
EASELBitmap.className = 'VIEW_EASEL_BITMAP'; // name of component on the ComponenDef object
EASELBitmap.priority = 10; // general position in the engine's component array; highest updated first


EASELBitmap.prototype = {
	constructor: EASELBitmap,
	
	configure: function(settings) {
		Tools.merge(this._display, settings);
	},
	
	activate: function() {
		this._display.x = this.position.x;
		this._display.y = this.position.y;
		this._display.visible = true;
		this.active = true;
	},
	
	disable: function() {
		this._display.visible = false;
		this.active = false;
	},
	
	update: function() {
		if (this.rotation && (this.rotation.y !== 0 || this.rotation.x !== 0)) {
			this._display.rotation = Math.atan2(this.rotation.y, this.rotation.x) * 57.2957795;
		}
		
		this._display.x = this.position.x;
		this._display.y = this.position.y;
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// null references
		this.entity = null;
		this.position = null;
	}
};

return EASELBitmap;

});