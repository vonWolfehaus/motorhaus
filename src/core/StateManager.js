/*
	Handles game states. Also fires off resource loading done by states, and acts as proxy between the Engine and States.
	
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
define(function(require) {

var Kai = require('core/Kai');
var Tower = require('core/CommTower');

/**
* The State Manager is responsible for loading, setting up and switching game states.
* It operates through Signals.
*/
var StateManager = function() {
	this.states = {};
	this.currentIdx = null;
	this.currentState = null;
	this.ready = false;
	
	// list for keeping track of active and pending states.
	this.queue = [];
};

StateManager.prototype = {
	/**
	 * Called by Engine when it first starts up.
	 */
	init: function() {
		Tower.requestState.add(this.switchState, this);
		Kai.load.onLoadComplete.add(this.loadComplete, this);
		
		this.next();
	},

	/**
	 * Add a new State by instantiating and storing it in an array for later access.
	 * This is actually a really dumb thing to do, so I'll be changing it soon.
	 * 
	 * @param key {string} - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
	 * @param state {State} - The state you want to switch to.
	 */
	add: function(key, state) {
		var newState;
		
		if (typeof state === 'object') {
			newState = state;
		} else if (typeof state === 'function') {
			newState = new state();
		}
		
		if (this.checkState(key, newState) === false) {
			return;
		}
		
		this.states[key] = newState;

		return newState;
	},

	/**
	 * Delete the given state. Not at all safe to actually use.
	 * @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
	 */
	remove: function(key) {
		delete this.states[key];
	},
	
	/**
	 * Not sure about this. Should bind instead of forwarding a single fucking function.
	 */
	update: function() {
		this.currentState.update();
	},
	
	/**
	 * I seriously don't like this.
	 */
	draw: function() {
		this.currentState.draw();
	},
	
	/**
	 * Load next state in queue. Received through CommTower.
	 * @param {string} [key] - State name to load (as set in engine.state.add())
	 * @param {boolean} [clearCache] - clear asset cache? (Default to false)
	 */
	switchState: function(key, clearCache) {
		if (!this.states[key]) {
			console.warn('[StateManager.switchState] '+key+' not found');
			return;
		}
		this.ready = false;
		
		this.queue.push(key);
		
		if (typeof clearCache === 'undefined') {
			clearCache = false;
		}
		
		this.next(clearCache);
	},

	next: function(clearCache) {
		if (this.queue.length === 0 || Kai.ready === false) {
			// console.log('[StateManager.switchState] Queue: '+this.queue.length+'; Engine ready: '+Kai.ready);
			return;
		}
		Kai.inputBlocked = true;
		
		if (clearCache) {
			Kai.cache.dispose();
		}
		
		if (!!this.currentIdx) {
			this.currentState = this.states[this.currentIdx];
			this.currentState.dispose();
		}
		
		this.currentIdx = this.queue.shift();
		this.currentState = this.states[this.currentIdx];
		
		Kai.load.reset();
		this.currentState.preload();
		Kai.load.start(); // when the loader is done, it will signal the CommTower
	},
	
	/**
	 * Make sure the state has everything it needs to function.
	 * @param {Object} state
	 */
	checkState: function(key, state) {
		var valid = false;
		
		if (!!this.states[key]) {
			console.error('[StateManager.checkState] Duplicate key: ' + key);
			return false;
		}
		
		if (!!state) {
			if (state['preload'] && state['create'] && state['update'] &&
			    state['draw'] && state['dispose']) {
				
				valid = true;
			}
			
			if (!valid) {
				console.error('[StateManager.checkState] Invalid State "'+key+'" given. Must contain all required functions.');
				return false;
			}

			return true;
			
		} else {
			console.error('[StateManager.checkState] No state found with the key: ' + key);
			return false;
		}
		return valid;
	},
	
	loadComplete: function() {
		this.currentState.create();
		Kai.inputBlocked = false;
		this.ready = true;
	},
	
	dispose: function() {
		this.states = null;
		this.queue = null;
	}

};

return StateManager;

});