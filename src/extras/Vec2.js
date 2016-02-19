/**
 * Optimized 2D general-purpose vector class with fairly complete functionality.
 */
mh.Vec2 = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

mh.Vec2.draw = function(ctx, v1, v2, drawingColor, camOffsetX, camOffsetY) {
	camOffsetX = camOffsetX || 0;
	camOffsetY = camOffsetY || 0;
	ctx.strokeStyle = !!drawingColor ? drawingColor : 'rgb(250, 10, 10)';
	ctx.beginPath();
	ctx.moveTo(v1.x + camOffsetX, v1.y + camOffsetY);
	ctx.lineTo(v2.x + camOffsetX, v2.y + camOffsetY);
	ctx.stroke();
};

mh.Vec2.prototype = {
	constructor: mh.Vec2,

	/*
	 * Sets the length which will change x and y, but not the angle.
	 */
	setLength: function(value) {
		var oldLength = this.getLength();
		if (oldLength !== 0 && value !== oldLength) {
			this.multiplyScalar(value / oldLength);
		}
		return this;
	},

	getLength: function() {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	},

	getLengthSq: function() {
		return (this.x * this.x) + (this.y * this.y);
	},

	setAngle: function(value) {
		var len = this.getAngle();
		this.x = Math.cos(value) * len;
		this.y = Math.sin(value) * len;
		return this;
	},

	getAngle: function() {
		return Math.atan2(this.y, this.x);
	},

	rotateBy: function(theta) {
		var x = this.x, y = this.y;
		var cos = Math.cos(theta), sin = Math.sin(theta);
		this.x = x * cos - y * sin;
		this.y = x * sin + y * cos;
		return this;
	},

	add: function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	},

	addScalar: function(s) {
		this.x += s;
		this.y += s;
		return this;
	},

	subtract: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	},

	subtractScalar: function(s) {
		this.x -= s;
		this.y -= s;
		return this;
	},

	multiply: function(v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	},

	multiplyScalar: function(s) {
		this.x *= s;
		this.y *= s;
		return this;
	},

	divide: function(v) {
		if (v.x === 0 || v.y === 0) return this;
		this.x /= v.x;
		this.y /= v.y;
		return this;
	},

	divideScalar: function(s) {
		if (s === 0) return this;
		this.x /= s;
		this.y /= s;
		return this;
	},

	/**
	 * Calculate the perpendicular vector (normal).
	 */
	perp: function() {
		var nx = -this.y;
		this.y = this.x;
		this.x = nx;
		return this;
	},

	negate: function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	},

	/**
	 * This function assumes min < max, if this assumption isn't true it will not operate correctly.
	 */
	clamp: function(min, max) {
		if ( this.x < min.x ) {
			this.x = min.x;
		} else if ( this.x > max.x ) {
			this.x = max.x;
		}
		if ( this.y < min.y ) {
			this.y = min.y;
		} else if ( this.y > max.y ) {
			this.y = max.y;
		}
		return this;
	},

	/**
	 * Calculate a vector dot product.
	 * @param {Vector2D} v A vector
	 * @return {Number} The dot product
	 */
	dotProduct: function(v) {
		return (this.x * v.x + this.y * v.y);
	},

	/**
	 * Calculate the cross product of this and another vector.
	 * @param {Vector2D} v A vector
	 * @return {Number} The cross product
	 */
	crossProd: function(v) {
		return this.x * v.y - this.y * v.x;
	},

	truncate: function(max) {
		var l = this.getLength();
	    if (l === 0 || l < max) return this;
	    this.x /= l;
		this.y /= l;
		this.multiplyScalar(max);
		return this;
	},

	angleTo: function(v) {
		var dx = this.x - v.x,
			dy = this.y - v.y;
		return Math.atan2(dy, dx);
	},

	distanceTo: function(v) {
		var dx = this.x - v.x,
			dy = this.y - v.y;
		return Math.sqrt((dx * dx) + (dy * dy));
	},

	distanceToSquared: function(v) {
		var dx = this.x - v.x,
			dy = this.y - v.y;
		return dx * dx + dy * dy;
	},

	lerp: function(v, alpha) {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		return this;
	},

	/**
	 * Normalize the vector
	 * @return {Vector2D}
	 */
	normalize: function() {
		var length = this.getLength();
		if (length === 0) return this;
		this.x /= length;
		this.y /= length;
		return this;
	},

	set: function(x, y) {
		x = x ? x : 0;
		y = y ? y : 0;
		this.x = x;
		this.y = y;
		return this;
	},

	equals: function(v) {
		if (this.x === v.x && this.y === v.y) return true;
		return false;
	},

	/**
	 * Copy from given Vector.
	 */
	copy: function(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	},

	/**
	 * Return a new Vector object using this as a start.
	 */
	clone: function() {
		return new Vec2(this.x, this.y);
	},

	/**
	 * Visualize this vector.
	 * @param {type} context 			HTML canvas 2D context to draw to.
	 * @param {type} [startX] 			X offset to draw from.
	 * @param {type} [startY] 			Y offset to draw from.
	 * @param {type} [drawingColor] 	CSS-compatible color to use.
	 */
	draw: function(ctx, startX, startY, drawingColor) {
		startX = !!startX ? startX : 0;
		startY = !!startY ? startY : 0;
		drawingColor = !!drawingColor ? drawingColor : 'rgb(0, 250, 0)';

		ctx.strokeStyle = drawingColor;
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
	},

	toString: function() {
		return '['+this.x+', '+this.y+']';
	}
};
