mh.SignalBinding = function(signal, listener, isOnce, listenerContext, priority) {
	if (typeof priority === 'undefined') { priority = 0; }
	this.active = true;
	this.params = null;
	this._listener = listener;
	this._isOnce = isOnce;
	this.context = listenerContext;
	this._signal = signal;
	this.priority = priority || 0;
};

mh.SignalBinding.prototype ={
	constructor: mh.SignalBinding,

	execute: function(paramsArr) {
		var handlerReturn;
		var params;

		if (this.active && !!this._listener) {
			params = this.params ? this.params.concat(paramsArr) : paramsArr;

			handlerReturn = this._listener.apply(this.context, params);

			if (this._isOnce) {
				this.detach();
			}
		}

		return handlerReturn;
	},

	detach: function() {
		return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
	},

	isBound: function() {
		return (!!this._signal && !!this._listener);
	},

	isOnce: function() {
		return this._isOnce;
	},

	getListener: function() {
		return this._listener;
	},

	getSignal: function() {
		return this._signal;
	},

	_destroy: function() {
		delete this._signal;
		delete this._listener;
		delete this.context;
	},

	toString: function() {
		return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
	}
};

mh.Signal = function() {
	this._bindings = [];
	this._prevParams = null;
	this.memorize = false;
	this._shouldPropagate = true;
	this.active = true;
},

mh.Signal.prototype = {
	constructor: mh.Signal,

	validateListener: function(listener, fnName) {
		if (typeof listener !== 'function') {
			throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
		}
	},

	_registerListener: function(listener, isOnce, listenerContext, priority) {
		var prevIndex = this._indexOfListener(listener, listenerContext);
		var binding;

		if (prevIndex !== -1) {
			binding = this._bindings[prevIndex];

			if (binding.isOnce() !== isOnce) {
				throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
			}
		}
		else {
			binding = new mh.SignalBinding(this, listener, isOnce, listenerContext, priority);

			this._addBinding(binding);
		}

		if (this.memorize && this._prevParams) {
			binding.execute(this._prevParams);
		}

		return binding;
	},

	_addBinding: function(binding) {
		var n = this._bindings.length;

		do {
			--n;
		}
		while(this._bindings[n] && binding.priority <= this._bindings[n].priority);

		this._bindings.splice(n + 1, 0, binding);
	},

	_indexOfListener: function(listener, context) {
		var n = this._bindings.length;
		var cur;

		while (n--) {
			cur = this._bindings[n];

			if (cur.getListener() === listener && cur.context === context) {
				return n;
			}
		}

		return -1;
	},

	has: function(listener, context) {
		if (typeof context === 'undefined') { context = null; }
		return this._indexOfListener(listener, context) !== -1;
	},

	add: function(listener, listenerContext, priority) {
		if (typeof listenerContext === 'undefined') { listenerContext = null; }
		if (typeof priority === 'undefined') { priority = 0; }
		this.validateListener(listener, 'add');

		return this._registerListener(listener, false, listenerContext, priority);
	},

	addOnce: function(listener, listenerContext, priority) {
		if (typeof listenerContext === 'undefined') { listenerContext = null; }
		if (typeof priority === 'undefined') { priority = 0; }
		this.validateListener(listener, 'addOnce');

		return this._registerListener(listener, true, listenerContext, priority);
	},

	remove: function(listener, context) {
		if (typeof context === 'undefined') { context = null; }
		this.validateListener(listener, 'remove');

		var i = this._indexOfListener(listener, context);

		if (i !== -1) {
			this._bindings[i]._destroy();
			this._bindings.splice(i, 1);
		}

		return listener;
	},

	removeAll: function() {
		var n = this._bindings.length;

		while (n--) {
			this._bindings[n]._destroy();
		}

		this._bindings.length = 0;
	},

	getNumListeners: function() {
		return this._bindings.length;
	},

	halt: function() {
		this._shouldPropagate = false;
	},

	dispatch: function() {
		var paramsArr = [];
		for (var _i = 0; _i < (arguments.length - 0); _i++) {
			paramsArr[_i] = arguments[_i + 0];
		}
		if (!this.active) {
			return;
		}

		var n = this._bindings.length;
		var bindings;

		if (this.memorize) {
			this._prevParams = paramsArr;
		}

		if (!n) {
			return;
		}

		bindings = this._bindings.slice(0);

		this._shouldPropagate = true;

		do {
			n--;
		} while(bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
	},

	forget: function() {
		this._prevParams = null;
	},

	dispose: function() {
		this.removeAll();

		delete this._bindings;
		delete this._prevParams;
	},

	toString: function() {
		return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
	}
};