/*
	The Engine holds the state manager, fires it off when the document is ready, and runs the one and only update loop. It ties all the other core modules together, setting everything up.
	
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
define(function(require) {

// imports
var Kai = require('core/Kai');
var Tower = require('core/CommTower');
var StateManager = require('core/StateManager');

var RAF = require('utils/RequestAnimationFrame');
var Loader = require('utils/Loader');
var Cache = require('utils/Cache');

var MouseController = require('components/input/MouseController');
var KeyboardController = require('components/input/KeyboardController');

/**
 * This is where we watch for doc load, setup essential components, and run the main loop.
 * Essentially ties everything together.
 * 
 * @author Corey Birnbaum
 */
var Engine = function() {
	if (Kai.debugMessages) {
		console.log('[Engine] Initializing');
	}
	
	this.state = new StateManager();
	this.raf = new RAF(this);
	
	this._paused = false;
	
	// dom init
	var self = this;
	this._onInit = function () {
		return self.init();
	};
	
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		window.setTimeout(this._onInit, 0);
	} else {
		document.addEventListener('DOMContentLoaded', this._onInit, false);
		window.addEventListener('load', this._onInit, false);
	}
	
};


Engine.prototype = {
	constructor: Engine,
	
	init: function() {
		if (Kai.ready) {
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
			// console.log('window has focus');
			Tower.resume.dispatch();
		}, false);
		window.addEventListener('blur', function(evt) {
			self._paused = true;
			// console.log('window lost focus');
			Tower.pause.dispatch();
		}, false);
		
		// init global components
		Kai.engine = this;
		Kai.mouse = new MouseController();
		Kai.keys = new KeyboardController();
		Kai.cache = new Cache();
		Kai.load = new Loader();
		
		Kai.ready = true;
		
		this.state.init();
		
		Kai.inputBlocked = false;
		
		if (Kai.debugMessages) {
			console.log('[Engine] Ready');
		}
		
		this.raf.start();
	},
	
	/**
	 * Set the first state to be used when everything is ready.
	 */
	start: function(state) {
		if (Kai.ready) {
			// state init would have already been called in this case
			return;
		}
		this.state.switchState(state);
	},
	
	update: function() {
		var i, node, obj,
			list = Kai.componentsSorted,
			len = list.length;
		
		if (this._paused) {
			// going to freeze it on the last frame
			// TODO: update a pause state? or remove this check and have the current state handle it through signals?
			return;
		}
		
		if (this.state.ready) {
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
			list = Kai.postComponents;
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
			}
			
			// update the state now that all components are fresh
			this.state.currentState.update();
			
		} else {
			// update transition state?
		}
		
		// we check first because some states might simply be DOM only and not need this
		if (Kai.renderHook) {
			Kai.renderHook();
		}
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// dispose components
		
		// null references
	}
	
};

return Engine;

});