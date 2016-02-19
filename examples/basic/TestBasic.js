var ex = ex || {};
ex.TestBasic = {
	create: function () {
		// we could pass the id to Easel, but i also want to set the size to the entire viewport
		// var canvas = document.getElementById('view');

		// the stage can be anything you want--for this example i chose to use Easel
		// mh.kai.view = new ex.Scene();

		// now we're ready to add entities, of which we only have one for sake of simplicity
		// this.cube = new ex.Cube();
		// this.cube.activate(new THREE.Vector3());
		console.log('created basic')
	},

	/*
		This is automatically called by the Engine, except with the window loses focus.
		You can listen for focus events by adding callbacks to the mh.tower.pause and mh.tower.resume Signals.
	*/
	update: function () {
		// mh.kai.view.render();
	},

	/*
		It's extremely important that you clean up your mess here, otherwise your other states will get slowed down since your game isn't just running all this state's stuff, but the next state's as well.
	*/
	dispose: function() {
		// this.cube.dispose();

		this.cube = null;
	}
};
