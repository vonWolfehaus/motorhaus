/*
	The Engine holds the state manager, fires it off when the document is ready, and runs the one and only update loop. It ties all the other core modules together, setting everything up.

	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
mh.Engine = function() {
	if (mh.kai.debugMessages) {
		console.log('[Engine] Initializing');
	}

	// a place to hold component definitions for fast reference
	mh.Component = {};

	this.state = new mh.StateManager();

	this._paused = false;

	// dom init
	var self = this;
	this._onInit = function () {
		return self.init();
	};

	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		window.setTimeout(this._onInit, 0);
	}
	else {
		document.addEventListener('DOMContentLoaded', this._onInit, false);
		window.addEventListener('load', this._onInit, false);
	}
};

mh.Engine.prototype = {
	constructor: mh.Engine,

	init: function() {
		if (mh.kai.ready) {
			return;
		}
		var self = this;
		if (!document.body) {
			window.setTimeout(this._onInit, 20);
			return;
		}

		document.removeEventListener('DOMContentLoaded', this._onInit);
		window.removeEventListener('load', this._onInit);

		window.addEventListener('focus', function(evt) {
			self._paused = false;
			mh.tower.resume.dispatch();
		}, false);
		window.addEventListener('blur', function(evt) {
			self._paused = true;
			mh.tower.pause.dispatch();
		}, false);

		// init global components
		mh.kai.engine = this;

		mh.kai.ready = true;

		this.state.init();

		mh.kai.inputBlocked = false;

		if (mh.kai.debugMessages) {
			console.log('[Engine] Ready');
		}

		this.updateBound = this.update.bind(this);
		this.updateBound();
	},

	/**
	 * Set the first state to be used when everything is ready.
	 */
	start: function(state) {
		if (mh.kai.ready) {
			// state init would have already been called in this case
			return;
		}
		this.state.queue(state);
		this.state.next();
	},

	update: function() {
		var i, node, obj,
			list = mh.kai.componentsSorted,
			len = list.length;

		if (this._paused) {
			// going to freeze it on the last frame
			// TODO: update a pause state? or remove this check and have the current state handle it through signals?
			requestAnimationFrame(this.updateBound);
			return;
		}

		if (this.state.ready) {
			if (mh.kai.debugCtx) {
				mh.kai.debugCtx.clearRect(0, 0, mh.kai.width, mh.kai.height);
			}
			// go through each list of components
			for (i = 0; i < len; i++) {
				if (!list[i]) continue;

				// and update each component within this list
				node = list[i].first;

				if (node && !node.obj.update) {
					// this component type doesn't have an update function
					continue;
				}

				while (node) {
					obj = node.obj;
					if (obj.active) {
						obj.update();
					}
					node = node.next;
				}
			}

			// go through the components that are registered with a postUpdate()
			/*list = mh.kai.postComponents;
			len = list.length;
			for (i = 0; i < len; i++) {
				if (!list[i]) continue;

				node = list[i].first;
				while (node) {
					obj = node.obj;
					if (obj.active) {
						obj.postUpdate();
					}
					node = node.next;
				}
			}*/

			// update the state now that all components are fresh
			this.state.current.update();
		}

		requestAnimationFrame(this.updateBound);
	},

	dispose: function() {
		// this.state.dispose();

		// dispose components

		// null references
	}
};
