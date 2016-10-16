mh.Point = function(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
};

mh.Point.prototype = {
	constructor: mh.Point,

	copy: function(p) {
		this.x = p.x;
		this.y = p.y;
		this.z = p.z;
	},

	clone: function() {
		return new mh.Point(this.x, this.y, this.z);
	},

	toString: function() {
		return '[Point (x='+this.x+' y='+this.y+' z='+this.z+')]';
	}
};
