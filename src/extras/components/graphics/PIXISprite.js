/*
	Abstracts pixi sprite creation so it's compatible with our entity-component system.
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
mh.PIXISprite = function(entity, settings) {
	settings = settings || {};
	mh.Base.call(this);

	this.textureUrl = 'img/square-outline-textured.png';
	this.container = mh.kai.view;

	mh.util.overwrite(this, settings);

	// private properties
	this.entity = entity;
	this._display = null;

	// prerequisite components
	this.position = entity.position;
};

// required statics for component system
mh.PIXISprite.accessor = 'view'; // property name as it sits on an entity
mh.PIXISprite.className = 'VIEW_SPRITE'; // name of component on the ComponenDef object
mh.PIXISprite.priority = 10; // general position in the engine's component array; highest updated first

mh.PIXISprite.prototype = {
	constructor: mh.PIXISprite,

	activate: function() {
		this.active = true;
	},

	disable: function() {
		this.active = false;
	},

	update: function() {

	},

	dispose: function() {
		this.disable();

		// null references
		this.entity = null;
		this.position = null;
	}
};
