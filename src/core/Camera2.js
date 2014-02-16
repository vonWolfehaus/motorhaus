/**
 * A Camera is your view into the game world. It has a position and size and renders only those objects within its field of view.
 * The game automatically creates a single Stage sized camera on boot. Move the camera around the world with Camera.
 * @author Richard Davey (Phaser)
 * @author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
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
	this.scalable = false; // scale if there are multiple targets and they get outside of view
	this.scale = 1;
	this.minScale = 0.3; // how far it can zoom out
	this.maxScale = 1; // how far to zoom in
	this.scalePadding = 100;
	this.target = null;
	this.targets = null;
	// {x, y, scaleX, scaleY} reference to the object that gets moved around by the camera to give the impression of a world larger than the screen.
	this.displayObject = null;
	// {Rectangle} Moving inside this Rectangle will not cause camera moving.
	this.deadzone = null;
	
	/**
	 * The Camera is bound to this Rectangle and cannot move outside of it. By default it is enabled and set to the size of the World.
	 * The Rectangle can be located anywhere in the world and updated as often as you like. If you don't wish the Camera to be bound
	 * at all then set this to null. The values can be anything and are in World coordinates, with 0,0 being the center of the world.
	 * @property {Rectangle} bounds - The Rectangle in which the Camera is bounded. Set to null to allow for movement anywhere.
	 */
	this.bounds = new Rectangle(0, 0, World.width, World.height);
	
	Tools.merge(this, settings);
	
	// base components
	this.position = new Vec2();
	// this.velocity = new Vec2();
	
	/**
	 * @property {boolean} atLimit - Whether this camera is flush with the World Bounds or not.
	 */
	this.atLimit = { x: false, y: false };
	
	this._edge = 0;
	
	// console.log(this.scalable);
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
	 * @param {Sprite} target - Vec2 or array of entities with positions to track. Set to null to not follow anything.
	 * @param {number} [style] Leverage one of the existing 'deadzone' presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
	 */
	follow: function (target, style) {
		if (typeof style === 'undefined') {
			style = Camera2.FOLLOW_TOPDOWN;
		}
		
		if (Object.prototype.toString.call(target) === '[object Array]' ) {
			console.log('[Camera2.follow] Tracking multiple targets');
			this.target = new Vec2();
			this.targets = target;
		} else {
			this.target = target;
		}

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
			this.updateTarget();
		}

		if (this.bounds) {
			this.checkBounds();
		}
		
		if (this.scalable) {
			this.displayObject.scaleX = this.scale;
			this.displayObject.scaleY = this.scale;
		}
		
		// this.displayObject.position.x = -this.position.x;
		// this.displayObject.position.y = -this.position.y;
		this.displayObject.x = -this.position.x;
		this.displayObject.y = -this.position.y;
	},

	updateTarget: function () {
		var i, minX, minY, maxX, maxY, w, h, rx, ry,
			t, len, lastActive, activeLen;
		
		// loop through all the targets to find bounding area
		if (this.targets) {
			len = this.targets.length;
			activeLen = 0;
			
			minX = Number.MAX_VALUE, minY = Number.MAX_VALUE;
			maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
			for (i = 0; i < len; i++) {
				t = this.targets[i];
				if (t.active) {
					activeLen++;
					lastActive = t;
					pos = t.position;
					if (pos.x < minX) minX = pos.x;
					if (pos.y < minY) minY = pos.y;
					if (pos.x > maxX) maxX = pos.x;
					if (pos.y > maxY) maxY = pos.y;
				}
			}
			
			if (activeLen > 1) {
				this.target.x = (minX + maxX) * 0.5;
				this.target.y = (minY + maxY) * 0.5;
				
				if (this.scalable) {
					w = maxX - minX + this.scalePadding;
					h = maxY - minY + this.scalePadding;
					
					rx = w === 0 ? 1 : Kai.width / w;
					ry = h === 0 ? 1 : Kai.height / h;
					if (rx < ry) {
						this.scale = rx;
					} else {
						this.scale = ry;
					}
					
					if (this.scale < this.minScale) {
						this.scale = this.minScale;
					} else if (this.scale > this.maxScale) {
						this.scale = this.maxScale;
					}
					
					this.target.x *= this.scale;
					this.target.y *= this.scale;
					
					// DebugDraw.circle(this.target.x - this.position.x, this.target.y - this.position.y, 2);
				}
				
			} else if (activeLen === 1) {
				this.target.x = lastActive.position.x;
				this.target.y = lastActive.position.y;
			}
		}
		
		if (this.deadzone) {
			this._edge = this.target.x - this.deadzone.x;
			if (this.position.x > this._edge) {
				this.position.x = this._edge;
			}

			this._edge = this.target.x - this.deadzone.x - this.deadzone.width;
			if (this.position.x < this._edge) {
				this.position.x = this._edge;
			}

			this._edge = this.target.y - this.deadzone.y;
			if (this.position.y > this._edge) {
				this.position.y = this._edge;
			}

			this._edge = this.target.y - this.deadzone.y - this.deadzone.height;
			if (this.position.y < this._edge) {
				this.position.y = this._edge;
			}
			
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
		if (this.position.x < this.bounds.x) {
			this.atLimit.x = true;
			this.position.x = this.bounds.x;
		}

		if (this.position.x > this.bounds.right - this.width) {
			this.atLimit.x = true;
			this.position.x = (this.bounds.right - this.width) + 1;
		}

		if (this.position.y < this.bounds.top) {
			this.atLimit.y = true;
			this.position.y = this.bounds.top;
		}

		if (this.position.y > this.bounds.bottom - this.height) {
			this.atLimit.y = true;
			this.position.y = (this.bounds.bottom - this.height) + 1;
		}

		this.position.x = Math.floor(this.position.x);
		this.position.y = Math.floor(this.position.y);
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

		if (this.bounds) {
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
