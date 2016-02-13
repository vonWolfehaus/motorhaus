define(function(require) {

// imports
var Kai = mh.Kai;

var Beetle = require('Beetle');

// state constructors are only called ONCE per page load.
// use create() and dispose() to clean up, and the constructor to define properties
var TemplateState = function() {
	// add properties
	this.thing = null;
};

TemplateState.prototype = {

	/**
	 * Any calls to Kai.load will queue up assets and nothing proceeds until they are completely loaded.
	 */
	preload: function () {
		Kai.load.image('beetle', '../shared/img/beetle.png');
	},

	/**
	 * Once everything is loaded, this is called. Here, it is safe to retrieve anything you loaded and
	 * can be sure all systems are ready for use.
	 */
	create: function () {
		// we could pass the id to Easel, but i also want to set the size to the entire viewport
		var canvas = document.getElementById('stage');
		canvas.width = Kai.width;
		canvas.height = Kai.height;

		// the stage can be anything you want--for this example i chose to use Easel
		Kai.stage = new createjs.Stage(canvas);

		// now we're ready to add entities, of which we only have one for sake of simplicity
		this.thing = new Beetle();
		this.thing.activate(new Vec2(100, 100));

		// renderHook is a reserved property that is called after the state update as well as while paused
		Kai.renderHook = this.draw.bind(this);
	},

	/**
	 * This is automatically called by the Engine, except with the window loses focus. You can listen for focus
	 * events by adding callbacks to the CommTower.pause and CommTower.resume Signals.
	 */
	update: function () {
		// no need to do anything here because all the action is happening in our components' update()
	},

	/**
	 * Any calls to Kai.load will queue up assets and nothing proceeds until they are completely loaded.
	 */
	draw: function () {
		Kai.stage.update();
	},

	/**
	 * It's extremely important that you clean up your mess here, since this class is always instantiated,
	 * and only dispose() and create() are called when states are switched. I should change this though.
	 */
	dispose: function() {
		this.thing.dispose();

		this.thing = null;
		Kai.renderHook = null;
		Kai.stage = null;
	}
};

return TemplateState;

});