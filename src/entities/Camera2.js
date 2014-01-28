/**
 * A Camera is your view into the game world. It has a position and size and renders only those objects within its field of view.
 * The game automatically creates a single Stage sized camera on boot. Move the camera around the world with Camera.
 * @author Richard Davey (Phaser)
 */
define(function(require) {

// imports
var Kai = require('core/Kai');
var World = require('entities/World');
var MathTools = require('math/MathTools');
var Tools = require('utils/Tools');
var Rectangle = require('math/Rectangle');

var Camera2 = function (settings) {
	require('core/Base').call(this);
	
	// attributes
	this.width = Kai.width;
	this.height = Kai.height;
	this.zoom = 1;
	this.target = null;
	this.targets = null;
	// {x, y, scaleX, scaleY} reference to the object that gets moved around by the camera to give the impression of a world larger than the screen.
	this.displayObject = null;
	// {Rectangle} Moving inside this Rectangle will not cause camera moving.
	this.deadzone = null;
	
	Tools.merge(this, settings);
	
	// base components
	this.position = new Vec2();
	// this.velocity = new Vec2();
	
	/**
	 * The Camera is bound to this Rectangle and cannot move outside of it. By default it is enabled and set to the size of the World.
	 * The Rectangle can be located anywhere in the world and updated as often as you like. If you don't wish the Camera to be bound
	 * at all then set this to null. The values can be anything and are in World coordinates, with 0,0 being the center of the world.
	 * @property {Rectangle} bounds - The Rectangle in which the Camera is bounded. Set to null to allow for movement anywhere.
	 */
	this.bounds = this.bounds || new Rectangle(0, 0, World.width, World.height);

	/**
	 * @property {boolean} atLimit - Whether this camera is flush with the World Bounds or not.
	 */
	this.atLimit = { x: false, y: false };
	
	this._edge = 0;
	
	// console.log(this);
};

Camera2.FOLLOW_LOCKON = 0;
Camera2.FOLLOW_PLATFORMER = 1;
Camera2.FOLLOW_TOPDOWN_LOOSE = 2;
Camera2.FOLLOW_TOPDOWN = 3;
Camera2.FOLLOW_TOPDOWN_TIGHT = 4;

Camera2.prototype = {

	/**
	 * Tells this camera which sprite to follow.
	 * @method Camera#follow
	 * @param {Sprite} target - The object you want the camera to track. Set to null to not follow anything.
	 * @param {number} [style] Leverage one of the existing 'deadzone' presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
	 */
	follow: function (target, style) {

		if (typeof style === 'undefined') {
			style = Camera2.FOLLOW_TOPDOWN;
		}

		this.target = target;

		var helper;

		switch (style) {

			case Camera2.FOLLOW_PLATFORMER:
				var w = this.width / 8;
				var h = this.height / 3;
				this.deadzone = new Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
				break;

			case Camera2.FOLLOW_TOPDOWN_LOOSE:
				helper = Math.max(this.width, this.height) / 2;
				this.deadzone = new Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
				break;
			
			case Camera2.FOLLOW_TOPDOWN:
				helper = Math.max(this.width, this.height) / 4;
				this.deadzone = new Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
				break;

			case Camera2.FOLLOW_TOPDOWN_TIGHT:
				helper = Math.max(this.width, this.height) / 8;
				this.deadzone = new Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
				break;
			
			case Camera2.FOLLOW_LOCKON:
				this.deadzone = null;
				break;

			default:
				this.deadzone = null;
				break;
		}

	},

	/**
	* Move the camera focus on a display object instantly.
	* @method Camera2#focusOn
	* @param {any} displayObject - The display object to focus the camera on. Must have visible x/y properties.
	*/
	focusOn: function (displayObject) {

		this.setPosition(Math.round(displayObject.x - (this.width*0.5)), Math.round(displayObject.y - (this.height*0.5)));

	},

	/**
	* Move the camera focus on a location instantly.
	* @method Camera2#focusOnXY
	* @param {number} x - X position.
	* @param {number} y - Y position.
	*/
	focusOnXY: function (x, y) {
		this.setPosition(Math.round(x - (this.width*0.5)), Math.round(y - (this.height*0.5)));
	},

	/**
	* Update focusing and scrolling.
	* @method Camera2#update
	*/
	update: function () {
		if (this.target) {
			// target must be set if you also want to use targets
			this.updateTarget();
		}

		if (this.bounds) {
			this.checkBounds();
		}

		this.displayObject.x = -this.position.x;
		this.displayObject.y = -this.position.y;
		// console.log(this.position.x+', '+this.position.y);
	},

	updateTarget: function () {
		var i, minX, minY, maxX, maxY, w = 0, h = 0,
			t, len;
		// loop through all the targets to find position min/max, which becomes target.x/y/width/height
		if (this.targets) {
			len = this.targets.length;
			minX = 0, minY = 0, maxX = 0, maxY = 0;
			for (i = 0; i < len; i++) {
				t = this.targets[i];
				if (t.x < minX) minX = t.x;
				if (t.y < minY) minY = t.y;
				if (t.x > maxX) maxX = t.x;
				if (t.y > maxY) maxY = t.y;
			}
			this.target.x = minX;
			this.target.y = minY;
			w = maxX - minX;
			h = maxY - minY;
			
			var dx = minX - maxX;
			var dy = minY - maxY;
			var dist = Math.sqrt((dx * dx) + (dy * dy));
			this.zoom = Math.tan(0.005 * 0.5) * (dist * 0.5);
			
		}
		
		if (this.deadzone) {
			this._edge = this.target.x - this.deadzone.x;

			if (this.position.x > this._edge) {
				this.position.x = this._edge;
			}

			this._edge = this.target.x + w - this.deadzone.x - this.deadzone.width;

			if (this.position.x < this._edge) {
				this.position.x = this._edge;
			}

			this._edge = this.target.y - this.deadzone.y;

			if (this.position.y > this._edge) {
				this.position.y = this._edge;
			}

			this._edge = this.target.y + h - this.deadzone.y - this.deadzone.height;

			if (this.position.y < this._edge) {
				this.position.y = this._edge;
			}
			
			this.displayObject.scaleX = this.displayObject.scaleY = this.zoom;
		} else {
			this.focusOnXY(this.target.x, this.target.y);
		}

	},

	setBoundsToWorld: function () {
		this.bounds.setTo(0, 0, World.width, World.height);
	},

	/**
	* Method called to ensure the camera doesn't venture outside of the game world.
	* @method Camera2#checkWorldBounds
	*/
	checkBounds: function () {

		this.atLimit.x = false;
		this.atLimit.y = false;

		//  Make sure we didn't go outside the cameras bounds
		if (this.position.x < this.bounds.x)
		{
			this.atLimit.x = true;
			this.position.x = this.bounds.x;
		}

		if (this.position.x > this.bounds.right - this.width)
		{
			this.atLimit.x = true;
			this.position.x = (this.bounds.right - this.width) + 1;
		}

		if (this.position.y < this.bounds.top)
		{
			this.atLimit.y = true;
			this.position.y = this.bounds.top;
		}

		if (this.position.y > this.bounds.bottom - this.height)
		{
			this.atLimit.y = true;
			this.position.y = (this.bounds.bottom - this.height) + 1;
		}

		// this.position.x = Math.floor(this.position.x);
		// this.position.y = Math.floor(this.position.y);

	},

	/**
	* A helper function to set both the X and Y properties of the camera at once
	* without having to use game.camera.x and game.camera.y.
	* 
	* @method Camera2#setPosition
	* @param {number} x - X position.
	* @param {number} y - Y position.
	*/
	setPosition: function (x, y) {

		this.position.x = x;
		this.position.y = y;

		if (this.bounds)
		{
			this.checkBounds();
		}

	},

	/**
	* Sets the size of the view rectangle given the width and height in parameters.
	* 
	* @method Camera2#setSize
	* @param {number} width - The desired width.
	* @param {number} height - The desired height.
	*/
	setSize: function (width, height) {

		this.width = width;
		this.height = height;

	}

};

return Camera2;

});
