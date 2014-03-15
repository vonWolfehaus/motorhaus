/*
	requirejs passes in the loaded classes into the callback's arguments pseudo-array,
	so we take advantage of that and go through that array, creating a plain object
	wrapper for each component that holds vital information about it, which we use in Engine
	and, in fact, by all entities as well. Check out Kai.registerComponents to see what I'm
	talking about.
	
	Those plain object wrappers (which I call component "definitions") allows us to dynamically
	augment entities at runtime, since we reference the definition and not the prototype directly.
	
	Kai creates an array of LinkedLists. Each List is a component type, containing all the instances
	of that type. The Engine grabs and loops through every List and calls `update()` anything in it.
	
	A lot of assumptions must be made for this to work, so I created the Templates to make building
	stuff a lot easier, and not have to remember what's what.
	
	@author Corey Birnbaum
*/
define(
	[
		'components/physics/AABB2',
		'components/physics/AABB3',
		'components/physics/RadialCollider2',
		'components/physics/CollisionGridScanner',
		'components/Health',
		'components/input/TwinStickMovement',
		'components/Timer',
		'components/ai/Wander',
		'components/GridTargeter'
	],
	function() {
		return require('core/Kai').registerComponents(arguments);
	}
);
