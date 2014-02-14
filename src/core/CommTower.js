define(['core/Signal'], function() {
	/**
	 * Global list of system-level Signals that anything can subscribe to.
	 */
	return {
		requestState: new Signal(),
		pause: new Signal(),
		resume: new Signal()
	};
	
});