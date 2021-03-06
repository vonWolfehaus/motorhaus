/*
	JavaScript utility functions

	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
mh.util = {
	PI: Math.PI,
	TAU: Math.PI * 2,
	DEG_TO_RAD: 0.0174532925,
	RAD_TO_DEG: 57.2957795,

	clamp: function(val, min, max) {
		return Math.max(min, Math.min(max, val));
	},

	sign: function(val) {
		return val && val / Math.abs(val);
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

	// from min to (and including) max
	randomInt: function(min, max) {
		if (arguments.length === 1) {
			return Math.floor((Math.random() * min) - (min * 0.5));
		}
		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	normalize: function(v, min, max) {
		return (v - min) / (max - min);
	},

	getShortRotation: function(angle) {
		angle %= this.TAU;
		if (angle > this.PI) {
			angle -= this.TAU;
		}
		else if (angle < -this.PI) {
			angle += this.TAU;
		}
		return angle;
	},

	generateID: function() {
		return Math.random().toString(36).slice(2) + Date.now();
	},

	isPlainObject: function(obj) {
		if (typeof(obj) !== 'object' || obj.nodeType || obj === obj.window) {
			return false;
		}
		try {
			if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
				return false;
			}
		}
		catch (err) {
			return false;
		}
		return true;
	},

	// https://github.com/KyleAMathews/deepmerge/blob/master/index.js
	merge: function(target, src) {
		var self = this, array = Array.isArray(src);
		var dst = array && [] || {};
		if (array) {
			target = target || [];
			dst = dst.concat(target);
			src.forEach(function(e, i) {
				if (typeof dst[i] === 'undefined') {
					dst[i] = e;
				}
				else if (self.isPlainObject(e)) {
					dst[i] = self.merge(target[i], e);
				}
				else {
					if (target.indexOf(e) === -1) {
						dst.push(e);
					}
				}
			});
			return dst;
		}
		if (target && self.isPlainObject(target)) {
			Object.keys(target).forEach(function (key) {
				dst[key] = target[key];
			});
		}
		Object.keys(src).forEach(function (key) {
			if (!src[key] || !self.isPlainObject(src[key])) {
				dst[key] = src[key];
			}
			else {
				if (!target[key]) {
					dst[key] = src[key];
				}
				else {
					dst[key] = self.merge(target[key], src[key]);
				}
			}
		});
		return dst;
	},

	overwrite: function(target, src) {
		for (var p in src) {
			if (target.hasOwnProperty(p) && src.hasOwnProperty(p)) {
				target[p] = src[p];
			}
		}
	},

	now: function() {
		return window.nwf ? window.nwf.system.Performance.elapsedTime : window.performance.now();
	},

	empty: function(node) {
		while (node.lastChild) {
			node.removeChild(node.lastChild);
		}
	},

	/*
		@source: http://jsperf.com/radix-sort
	 */
	radixSort: function(arr, idxBegin, idxEnd, bit) {
		idxBegin = idxBegin || 0;
		idxEnd = idxEnd || arr.length;
		bit = bit || 31;
		if (idxBegin >= (idxEnd - 1) || bit < 0) {
			return;
		}
		var idx = idxBegin;
		var idxOnes = idxEnd;
		var mask = 0x1 << bit;
		while (idx < idxOnes) {
			if (arr[idx] & mask) {
				--idxOnes;
				var tmp = arr[idx];
				arr[idx] = arr[idxOnes];
				arr[idxOnes] = tmp;
			}
			else {
				++idx;
			}
		}
		this.radixSort(arr, idxBegin, idxOnes, bit-1);
		this.radixSort(arr, idxOnes, idxEnd, bit-1);
	}
};
