var Thing = function() {
	mh.Base.call(this);

	// attributes
	this.speed = 1;

	// base components
	this.position = new mh.Vec2(posx, posy);
	this.velocity = new mh.Vec2(mh.util.random(this.speed), mh.util.random(this.speed));

	// complex components
	mh.kai.addComponent(this, mh.Component.THING, {
		foo: 2
	});
};

Thing.prototype = {
	constructor: Thing,

	/*_________________________________________________________________
			PUBLIC
	*/

	activate: function() {
		this.active = true;
	},

	disable: function() {
		this.active = false;
	},

	dispose: function() {
		// remove signal callbacks

		// dispose components
		Kai.removeComponent(this, mh.Component.THING);

		// null references
		this.position = null;
		this.velocity = null;
	},

	/*_________________________________________________________________
			PRIVATE: EVENTS
	*/

	_signalCallback: function() {

	}

};
