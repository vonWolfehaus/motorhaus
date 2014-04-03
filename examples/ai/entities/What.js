define(function(require) {
	
// imports
var Kai = require('core/Kai');
var VonComponents = require('components/VonComponents');
var MathTools = require('math/MathTools');

var Steering = require('ai/Steering');

// constructor
var SeekBoid = function(posx, posy) {
	require('core/Base').call(this);
	
	// private
	var img = Kai.cache.getImage('beetle');
	var radius = Math.floor(img.height / 2);
	var diameter = radius * 2;
	
	// attributes
	this.speed = 1;
	
	// base components
	this.position = new Vec2(posx, posy);
	this.velocity = new Vec2(MathTools.random(this.speed), MathTools.random(this.speed));
	
	// complex components
	Kai.addComponent(this, VonComponents.BOID);
	Kai.addComponent(this, VonComponents.STACK_FSM);
	Kai.addComponent(this, VonComponents.BODY_RADIAL_COLLIDER2, {
		radius: 25,
		restitution: 0.4
	});
	Kai.addComponent(this, CustomType.VIEW_VON_SPRITE, {
		image: img,
		width: diameter,
		height: diameter,
		container: Kai.layer
	});
	
	this.stackFSM.pushState(Steering.Wander);
};


SeekBoid.prototype = {
	constructor: SeekBoid,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	activate: function() {
		this.active = true;
		this.stackFSM.activate();
	},
	
	disable: function() {
		this.active = false;
		this.stackFSM.disable();
	},
	
	dispose: function() {
		// remove signal callbacks
		
		// dispose components
		Kai.removeComponent(this, VonComponents.STACK_FSM);
		
		// null references
		this.position = null;
		this.velocity = null;
	},
	
	/*-------------------------------------------------------------------------------
									BEHAVIORS
	-------------------------------------------------------------------------------*/
	
	follow: function() {
		// If we're not shooting at something, follow the leader.
		var aLeader = Game.instance.boids[0];
		addSteeringForce(Steering.followLeader(aLeader));
		
		// Is there a monster nearby?
		if (getNearestEnemy() != null) {
			// Yes, there is! Hunt it down!
			// Push the "hunt" state. It will make the soldier stop following the leader and
			// start hunting the monster.
			this.stackFSM.pushState(hunt);
		} else {
			// No monster around, so check if there is an item to collect (or run away from).
			checkItemsNearby();
		}
	},
	
	hunt: function() {
		var aNearestEnemy :Monster = getNearestEnemy();

		// Do we have a monster nearby?
		if (aNearestEnemy != null) {
			// Yes, we do. Let's calculate how distant it is.
			var aDistance = calculateDistance(aNearestEnemy, this);

			// Is the monster close enough to shoot?
			if (aDistance <= 80) {
				// Yes, so let's face it!
				faceEnemyStandingStill(aNearestEnemy);
				// Kill it with fire!
				shoot();
				
			} else {
				// No, the monster is far away. Seek it until it gets close enough.
				addSteeringForce(Steering.seek(aNearestEnemy.boid.position));
				
				// Avoid crowding while seeking the target...
				addSteeringForce(Steering.separate());
			}
		} else {
			// No, there is no monster nearby. Maybe it was killed or ran away. Let's pop the "hunt"
			// state and come back doing what we were doing before the hunting.
			this.stackFSM.popState();

			// Check if there is an item to collect (or run away from)
			checkItemsNearby();
		}
	}
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_uponDeath: function() {
		
	}
	
};

return SeekBoid;

});