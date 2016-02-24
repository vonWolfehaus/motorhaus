/*
	This is a simple entity that has a threejs cube and our state machine that we use to add dynamic behavior.
	It's a very typical entity setup that shows how components reference the entity and manage them.
*/
ex.Cube = function() {
	mh.Base.call(this);

	// attributes
	this.speed = 10;
	this.spinSpeed = 0.007;

	// base components
	this.position = new THREE.Vector3();
	this.velocity = new THREE.Vector3();
	this.rotation = new THREE.Vector3();

	// complex components
	mh.kai.addComponent(this, mh.Component.VIEW_CUBE);
	mh.kai.addComponent(this, mh.Component.STACK_FSM);
};

ex.Cube.prototype = {
	constructor: ex.Cube,

	/*_________________________________________________________________
			PUBLIC
	*/

	activate: function() {
		this.active = true;
		// don't forget to ALWAYS activate the components here
		this.view.activate();
		this.stack.activate();

		// this is the first state it will run, starting now
		this.stack.pushState(this.idle, this);
	},

	disable: function() {
		this.active = false;
		// and of course disable them as well
		this.view.disable();
		this.stack.disable();
	},

	dispose: function() {
		// dispose components
		mh.kai.removeComponent(this, mh.Component.VIEW_CUBE);
		mh.kai.removeComponent(this, mh.Component.STACK_FSM);

		// null references
		this.position = null;
		this.velocity = null;
	},

	/*_________________________________________________________________
			BEHAVIORS
			these run every tick because we're hooked into the update method of the stack component
	*/

	idle: function() {
		// let's spin mr cube
		this.rotation.x += this.spinSpeed;
		this.rotation.y += this.spinSpeed;
	}
};
