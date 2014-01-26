/**
 * Global state resources. No idea why I called it 'Kai'.
 */
define(['require', 'math/Vec2', 'lib/LinkedList'],
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
		
		width: 0, // screen size (in pixels); renderer or state is supposed to set this
		height: 0,
		
		ready: false, // true when all systems are go
		inputBlocked: true, // always block input while states are loading
		
		registerComponent: function(i) {
			if (!!this.components[i]) {
				return this.components[i];
			}
			this.components[i] = new LinkedList();
			return this.components[i];
		},
		
		addComponent: function(entity, compDef, options) {
			var prop = compDef.accessor,
				compInstance = null;
			
			options = options || null;
			
			if (!entity.hasOwnProperty(prop)) {
				// console.log('[Kai] Adding '+prop);
				compInstance = new compDef.proto(entity, options);
				entity[prop] = compInstance;
				
				this.registerComponent(compDef.index).add(compInstance);
				
			} /*else console.log('[Kai] '+prop+' already exists on entity');*/
			
			return entity[prop];
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