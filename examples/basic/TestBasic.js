var ex = ex || {};
/*
	This is a very simple state that only implements the bare minimum.
	We setup a threejs scene, then add some lighting and a cube
*/
ex.TestBasic = {
	create: function () {
		// using the convenient mh.Scene wrapper for threejs, we set things up
		// we use mh.kai so that we can access it from anywhere in our game, most importantly from within components
		mh.kai.view = new mh.Scene({
			element: document.getElementById('view'),
			cameraPosition: {x: 0, y: 0, z: 500},
			light: null // set this to null to prevent mh.Scene from adding a DirectionalLight
		});

		// i'm going to get a little fancier than the stock settings above and add different lights to the scene
		var lights = [];
		lights[0] = new THREE.PointLight(0xffffff, 1, 0);
		lights[1] = new THREE.PointLight(0xffffff, 1, 0);
		lights[2] = new THREE.PointLight(0xffffff, 1, 0);

		lights[0].position.set(0, 200, 0);
		lights[1].position.set(100, 200, 100);
		lights[2].position.set(-100, -200, -100);

		mh.kai.view.add(lights[0]);
		mh.kai.view.add(lights[1]);
		mh.kai.view.add(lights[2]);

		// now we're ready to add entities, of which we only have one for sake of simplicity
		this.cube = new ex.Cube();
		// active it right away since this is the only action we're going to see here
		this.cube.activate();

		// that's all we have to do; the engine will now update all active components that are on active entities
		console.log('[TestBasic] Created');
	},

	/*
		This is automatically called by the Engine, except with the window loses focus.
		You can listen for focus events by adding callbacks to the mh.tower.pause and mh.tower.resume Signals.
	*/
	update: function () {
		mh.kai.view.render();
	},

	/*
		It's extremely important that you clean up your mess here, otherwise your other states will get slowed down since your game isn't just running all this state's stuff, but the next state's as well.
	*/
	dispose: function() {
		this.cube.dispose();
		this.cube = null;
	}
};
