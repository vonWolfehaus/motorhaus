mh.Rectangle = function (x, y, width, height) {
	x = x || 0;
	y = y || 0;
	width = width || 0;
	height = height || 0;

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

mh.Rectangle.prototype = {
	constructor: mh.Rectangle,

	copy: function (source) {
		this.x = source.x;
		this.y = source.y;
		this.width = source.width;
		this.height = source.height;
		return this;
	},

	clone: function() {
		return new mh.Rectangle(this.x, this.y, this.width, this.height);
	},

	inflate: function (dx, dy) {
		this.x -= dx;
		this.width += 2 * dx;
		this.y -= dy;
		this.height += 2 * dy;
		return this;
	},

	toString: function () {
		return '[Rectangle (x=' + this.x + ' y=' + this.y + ' width=' + this.width + ' height=' + this.height + ' empty=' + this.empty + ')]';
	}
};
