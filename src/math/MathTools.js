define(function() {
	return {
		PI: Math.PI,
		TAU: Math.PI * 2,
		
		clamp: function(val, min, max) {
			return Math.max(min, Math.min(max, val));
		},
		
		sign: function(val) {
			return number && number / Math.abs(number);
		},
		
		/**
		 * If one value is passed, it will return something from -val to val.
		 * Else it returns a value between the range specified by min, max.
		 */
		random: function(min, max) {
			if (arguments.length === 1) {
				return (Math.random() * min) - (min * 0.5);
			}
			return Math.random() * (max - min) + min;
		},
		
		randomInt: function(min, max) {
			if (arguments.length === 1) {
				return Math.floor((Math.random() * min) - (min * 0.5));
			}
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		
		getShortRotation: function(angle) {
			angle %= this.TAU;
			if (angle > this.PI) {
				angle -= this.TAU;
			} else if (angle < -this.PI) {
				angle += this.TAU;
			}
			return angle;
		}
	};
});