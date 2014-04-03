/*
	Global state resources object that also manages components. No idea why I called it 'Kai'.
	I consider this the most important part of the engine, since it makes the whole entity-component thing work.
	
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
define(['require', 'math/Vec2', 'core/LinkedList'],
		function(require) {
	
	return {
		engine: null,
		stage: null, // the graphics manager (threejs, pixi, easel, etc..)
		renderHook: null, // function that gets called to execute drawing once a tick
		world: null, // optional, defined in states
		
		mouse: null,
		keys: null,
		pads: null, // optional GamepadController, if you want
		cache: null, // you don't need to worry about this
		load: null, // resource manager
		
		debugCtx: null, // optional, for debug drawing components
		debugMessages: true, // will log core activity if true
		
		components: [], // we manipulate lists of ALL components here (even postUpdate ones)...
		componentsSorted: [], // ...but Engine iterates through this array which is sorted by update priority
		// postComponents: [], // this is also sorted, but we merely reference lists from this.components
		componentDefinitions: [],
		numComponents: 0,
		
		width: window.innerWidth, // screen size (in pixels); renderer or state usually sets this
		height: window.innerHeight,
		
		ready: false, // true when all systems are go
		inputBlocked: true, // always block input while states are loading
		
		/*
			Very handy utility that not only makes sure the entity has the component you're looking for, but will add it to the entity for you if it isn't already there. If the component doesn't exist (which happens a lot when creating a lot of components, as you forget to add them to the definition module, such as VonComponents), it will kindly remind you.
			If you're not looking for a component and instead expect a regular type of object, pass in that object's prototype as the third parameter and it will either return what's already on the entity, or instantiate it for you.
		 */
		expect: function(entity, prop, Clazz) {
			var i;
			if (!entity[prop]) {
				if (!Clazz) {
					// assume it's a component, so try to find it
					for (i = 0; i < this.componentDefinitions.length; i++) {
						Clazz = this.componentDefinitions[i];
						if (Clazz.accessor === prop) {
							// it's registered, so let's take this instance to use for its static properties to register a new one with
							break;
						}
					}
					
					if (!Clazz) {
						// didn't find it, must not have been registered yet
						throw new Error('[Kai.expect] The component "'+prop+'" does not exist. You might have forgotten to create a component list object (just like VonComponents.js), or forgot to add this component to that list.');
					}
					
					// add it for them
					this.addComponent(entity, Clazz);
					if (this.debugMessages) {
						console.info('[Kai.expect] '+prop.toUpperCase()+' component was added to '+entity.toString()+' with default values');
					}
				
				} else {
					// just an object we can instantiate directly
					entity[prop] = new Clazz();
					/*if (this.debugMessages) {
						console.info('[Kai.expect] A "'+prop+'" property was added to '+entity.toString()+' for you');
					}*/
				}
			}
			// return the entity's reference to the object so it can be shared with other components
			return entity[prop];
		},
		
		/*
			Utility that properly constructs a hash from the passed array of prototypes, so it can be used by addComponent.
			Creates a new home for a specific component type, where all instances of it will live and be accessed from in Engine's `update()`.
		*/
		registerComponents: function(factoryList) {
			var i, k, def, list, len = factoryList.length,
				Factory, exportedComponents = {};
			
			for (i = 0; i < len; i++) {
				Factory = factoryList[i];
				
				
				k = this.numComponents;
				exportedComponents[Factory.className] = {
					accessor: Factory.accessor,
					proto: Factory,
					index: k,
					priority: Factory.priority // this is only used for sorting below
				};
				// we track number of components so that we can make multiple calls to this.registerComponents
				// and not overwrite the previous components. this is necessary for supporting external component types
				this.numComponents++;
				
				if (!!this.components[k]) {
					continue;
				}
				
				list = new LinkedList();
				list.priority = Factory.priority;
				// the order of this.components and this.componentDefinitions is extremely important,
				// otherwise we'd be adding one component type into a list belonging to another component type...
				this.components[k] = list;
				this.componentDefinitions[k] = exportedComponents[Factory.className];
				
				// ...which is why we need to keep a different array of the lists that we *can* sort without
				// causing a ruckus. once lists are created, we only add/remove instances to this.components, but
				// they will also show up in this other sorted array, so everything works out
				this.componentsSorted[k] = list;
				/*if (Factory.post) {
					this.postComponents.push(list);
				}*/
				
				if (this.debugMessages) {
					console.info('[Kai] Registered '+Factory.className);
				}
			}
			
			// sort arrays according to component priority; these are the ones we'll loop through in Engine
			function compare(a, b) {
				return a.priority - b.priority;
			}
			this.componentsSorted.sort(compare);
			// this.postComponents.sort(compare);
			
			return exportedComponents;
		},
		
		/*
			arr is an optional param, where the component will push itself to if present, otherwise it will attach directly to the entity
		*/
		addComponent: function(entity, compDef, options, arr) {
			var prop = compDef.accessor,
				compInstance = null;
			
			options = options || null;
			
			if (entity.hasOwnProperty(prop)) {
				if (this.debugMessages) {
					console.warn('[Kai.addComponent] "'+prop+'" already exists on entity '+entity.toString());
				}
				return;
			}
			
			compInstance = new compDef.proto(entity, options);
			this.components[compDef.index].add(compInstance);
			
			if (typeof arr === 'undefined') {
				entity[prop] = compInstance;
				
			} else {
				arr.push(compInstance);
			}
		},
		
		/*
			Call this in your entity's `dispose()`, otherwise it will pollute the list and cause the Engine to iterate through more objects than it has to, which could lead to performance degradation.
		*/
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