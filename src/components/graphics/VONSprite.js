/**
 * Class description
 */
define(function(require) {
	
// imports
var Kai = require('core/Kai');
var Tools = require('utils/Tools');
var Matrix2 = require('math/Matrix2');
var Sprite = require('Sprite');

// constructor
var VONSprite = function(entity, settings) {
	// augment with Base
	require('core/Base').call(this);
	
	this.image = null;
	this.width = 0;
	this.height = 0;
	
	// attribute override
	Tools.merge(this, settings);
	
	if (this.width === 0) {
		this.width = this.image.width;
	}
	if (this.height === 0) {
		this.height = this.image.height;
	}
	
	// private properties
	this.entity = entity;
	this._display = new Sprite(this.image);
	
	// prerequisite components
	this.position = this._display.position = entity.position;
	this.rotation = entity.rotation;
	
	Kai.stage.addChild(this._display);
};

// required statics for component system
VONSprite.accessor = 'view'; // property name as it sits on an entity
VONSprite.className = 'VIEW_VON_SPRITE'; // name of component on the ComponenDef object
VONSprite.priority = 10; // general position in the engine's component array; highest updated first


VONSprite.prototype = {
	constructor: VONSprite,
	
	configure: function(settings) {
		Tools.merge(this._display, settings);
	},
	
	activate: function() {
		// this._display.x = this.position.x;
		// this._display.y = this.position.y;
		this._display.visible = true;
		this.active = true;
	},
	
	disable: function() {
		this._display.visible = false;
		this.active = false;
	},
	
	update: function() {
		if (this.rotation && (this.rotation.y !== 0 || this.rotation.x !== 0)) {
			this._display.angle = Math.atan2(this.rotation.y, this.rotation.x);
		}
		
		// this._display.x = this.position.x;
		// this._display.y = this.position.y;
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// null references
		this.entity = null;
		this.position = null;
	}
};

return VONSprite;

});