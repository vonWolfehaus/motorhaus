/**
 * Class description
 */
define(function(require) {
	
// imports
var Kai = require('core/Kai');
var Tools = require('utils/Tools');

// constructor
var VonSprite = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	// public properties
	this.image = null;
	this.width = 0;
	this.height = 0;
	
	// attribute override
	Tools.merge(this, settings);
	
	// other properties
	this.entity = entity;
	this._display = new von2d.Sprite(this.image);
	this._display.visible = false;
	
	// prerequisite components
	this.position = Kai.expect(entity, 'position', Vec2);
	this.rotation = Kai.expect(entity, 'rotation', Vec2);
	
	this._display.position = this.position;
	if (settings.container) {
		settings.container.addChild(this._display);
	}
};

// required statics for component system
VonSprite.accessor = 'view'; // property name as it sits on an entity
VonSprite.className = 'VIEW_VON_SPRITE'; // name of component on the component definition object
VonSprite.priority = 50; // general position in the engine's component array; the lower, the earlier it's updated
VonSprite.post = false; // whether or not this component will have a postUpdate() called on it


VonSprite.prototype = {
	constructor: VonSprite,
	
	configure: function(settings) {
		Tools.merge(this._display, settings);
	},
	
	activate: function() {
		this.active = true;
		this._display.visible = true;
	},
	
	disable: function() {
		this.active = false;
		this._display.visible = false;
	},
	
	update: function() {
		// if (this.rotation.y !== 0 || this.rotation.x !== 0) {
			this._display.rotation = Math.atan2(this.rotation.y, this.rotation.x);
		// }
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// null references
		this.entity = null;
		this.position = null;
	}
};

return VonSprite;

});