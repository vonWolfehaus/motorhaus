/**
 * Global state resources. No idea why I called it 'Kai'.
 */
define(['require', 'math/Vec2', 'core/LinkedList'],
		function(require) {
	
	// var DebugDraw = require('utils/DebugDraw');
	
	return {
		engine: null,
		view: null, // the graphics manager (threejs, pixi, etc..)
		renderHook: null, // function that gets called to execute drawing once a tick
		world: null,
		
		mouse: null,
		keys: null,
		pads: null,
		cache: null,
		load: null, // resource manager
		
		debugCtx: null, // optional, for debug drawing components
		
		components: [],
		
		width: window.innerWidth, // screen size (in pixels); renderer or state usually sets this
		height: window.innerHeight,
		
		ready: false, // true when all systems are go
		inputBlocked: true, // always block input while states are loading
		
		registerComponent: function(i) {
			if (!!this.components[i]) {
				return this.components[i];
			}
			this.components[i] = new LinkedList();
			return this.components[i];
		},
		
		// arr is an optional param, where the component will push itself to if present, otherwise it will attach directly to the entity
		addComponent: function(entity, compDef, options, arr) {
			var prop = compDef.accessor,
				compInstance = null;
			
			options = options || null;
			
			if (entity.hasOwnProperty(prop)) {
				console.warn('[Kai] '+prop+' already exists on entity');
				return;
			}
			
			compInstance = new compDef.proto(entity, options);
			this.registerComponent(compDef.index).add(compInstance);
			
			if (typeof arr === 'undefined') {
				entity[prop] = compInstance;
				
			} else {
				arr.push(compInstance);
			}
		},
		
		removeComponent: function(entity, compDef) {
			var prop = compDef.accessor;
			
			if (entity.hasOwnProperty(prop)) {
				this.components[compDef.index].remove(entity[prop]);
				entity[prop].dispose();
				entity[prop] = null;
			}
		}
		
	};
	
});