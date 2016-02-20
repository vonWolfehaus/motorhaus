/*
	Basic mouse tracker that exposes screen position, modifier keys, and events as Signals.
	Not a component.
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
mh.MouseController = function() {
	this.position = new mh.Vec2();

	this.onDown = new mh.Signal();
	this.onUp = new mh.Signal();

	this.down = false;
	this.shift = false;
	this.ctrl = false;

	document.addEventListener('mousedown', this.onMouseDown, false);
	document.addEventListener('mouseup', this.onMouseUp, false);
	document.addEventListener('mouseout', this.onMouseUp, false);
	document.addEventListener('mousemove', this.onMouseMove, false);
	document.addEventListener('contextmenu', this.onMouseContext, false);
};

mh.MouseController.prototype = {
	constructor: mh.MouseController,

	onMouseDown: function(evt) {
		if (mh.kai.inputBlocked) {
			evt.preventDefault();
			return;
		}

		this.position.x = evt.pageX;
		this.position.y = evt.pageY;
		this.down = true;

		this.shift = !!evt.shiftKey;
		this.ctrl = !!evt.ctrlKey;

		this.onDown.dispatch(this.position);
	},

	onMouseUp: function(evt) {
		if (!this.down || mh.kai.inputBlocked) {
			evt.preventDefault();
			return;
		}

		this.position.x = evt.pageX;
		this.position.y = evt.pageY;
		this.down = false;

		this.shift = !!evt.shiftKey;
		this.ctrl = !!evt.ctrlKey;

		this.onUp.dispatch(this.position);
	},

	onMouseMove: function(evt) {
		evt.preventDefault();

		this.position.x = evt.pageX;
		this.position.y = evt.pageY;

		this.shift = !!evt.shiftKey;
		this.ctrl = !!evt.ctrlKey;
	},

	onMouseContext: function(evt) {
		evt.preventDefault();
		return false;
	}
};
