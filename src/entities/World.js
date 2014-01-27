define(function(require) {
var Tools = require('utils/Tools');

return {
	width: 1,
	height: 1,
	depth: 1,
	scale: 1,
	gravity: 8,
	friction: 0.98,
	elapsed: 0.01666,
	broadphase: null,
	map: null,
	
	set: function(settings) {
		Tools.merge(this, settings);
	}/*,
	
	update: function() {
		if (this.broadphase) {
			this.broadphase.update();
		}
		if (this.map) {
			this.map.update();
		}
	}*/
};

});