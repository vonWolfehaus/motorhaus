define(function() {
/**
 * Controls an entities lifespan.
 * 
 * @author Corey Birnbaum
 */
return function Health(m, o) {
	this.max = m || 100;
	this.overage = o || 0;
	
	this.alive = false;
	
	this.deathSignal = new Signal();
	this.damageSignal = new Signal();
	this.healSignal = new Signal();
	this.fullSignal = new Signal();
	
	// current health amount. it's private because you must only change it through the functions
	var _meter = 0;
	
	this.reset = function() {
		_meter = this.max;
		this.alive = true;
	};
	
	this.change = function(amount) {
		_meter += amount;
		
		if (_meter <= 0) {
			_meter = 0;
			this.alive = false;
			
			deathSignal.dispatch(amount);
		} else {
			if (_meter > this.max + this.overage) {
				_meter = this.max;
				
				fullSignal.dispatch(amount);
			}
			
			if (amount < 0) damageSignal.dispatch(amount);
			else healSignal.dispatch(amount);
		}
		
		return _meter;
	};
	
	/**
	 * Deplete any overage health safely.
	 */
	this.drain = function(amount) {
		if (_meter > this.max) {
			_meter -= amount;
			if (_meter <= this.max) {
				_meter = this.max;
				
				fullSignal.dispatch(amount);
			}
		}
		return _meter;
	};
} // class

});
