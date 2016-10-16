/*
	Handles game state life cycles. Also acts as proxy between the Engine and States.
	It operates through Signals found in mh.tower.

	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/

mh.StateManager = function() {
	this.states = {};
	this.current = null;
	this.currentKey = null;
	this.ready = false;

	// list for keeping track of active and pending states.
	this._q = [];
};

mh.StateManager.prototype = {
	constructor: mh.StateManager,

	/**
	 * Called by Engine when it first starts up.
	 */
	init: function() {
		mh.tower.requestState.add(function(key) {
			this.queue(key);
			this.next();
		}, this);

		this.next();
	},

	/**
	 * Add a new State by instantiating and storing it in an array for later access.
	 * This is actually a really dumb thing to do, so I'll be changing it soon.
	 *
	 * @param key {string} - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
	 * @param state {State} - The state you want to switch to.
	 */
	add: function(key, StateObj) {
		if (this.checkState(key, StateObj) === false) {
			return;
		}
		this.states[key] = StateObj;

		return this;
	},

	/**
	 * Delete the given state. Not at all safe to actually use.
	 * @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
	 */
	remove: function(key) {
		delete this.states[key];
	},

	/**
	 * Load next state in queue. Received through CommTower.
	 * @param {string} [key] - State name to load (as set in engine.state.add())
	 */
	queue: function(key) {
		if (!this.states[key]) {
			console.warn('[StateManager.queue] '+key+' not found; add it first');
			return;
		}
		this._q.push(key);

		return this;
	},

	next: function() {
		if (this._q.length === 0 || mh.kai.ready === false) {
			console.log('[StateManager.next] _q length: '+this._q.length+'; Engine ready: '+mh.kai.ready);
			return;
		}
		this.ready = false;
		mh.kai.inputBlocked = true;

		if (this.currentKey) {
			this.current = this.states[this.currentKey];
			this.current.dispose();
		}

		this.currentKey = this._q.shift();
		this.current = this.states[this.currentKey];
		this.current.create();

		mh.kai.inputBlocked = false;
		this.ready = true;

		return this;
	},

	/**
	 * Make sure the state has everything it needs to function.
	 * @param {Object} state
	 */
	checkState: function(key, state) {
		if (this.states[key]) {
			console.error('[StateManager.checkState] Duplicate key: ' + key);
			return false;
		}

		if (typeof state === 'function') {
			console.error('[StateManager.checkState] States must be object literals, not functions');
			return false;
		}

		if (state) {
			if (state.create && state.update && state.dispose) {
				return true;
			}

			console.error('[StateManager.checkState] Invalid State "'+key+'" given. Must contain all required functions: create, update, dispose');
			return false;
		}
		else {
			console.error('[StateManager.checkState] No state found with the key: ' + key);
			return false;
		}
	},

	dispose: function() {
		this.states = null;
		this.idxOnes = null;
	}
};
