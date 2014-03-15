define(function(require) {

// imports
var Vec2 = require('math/Vec2');

/*
	Static class of functions for steering agents according to a set of base behaviors.
	
	All agents passed into these functions are required to have these properties:
		* position:Vec2
		* velocity:Vec2
		* minSeparation:number
		* maxCohesion:number
		* speed:number
		* maxAccel:number
*/
var Steering = {
	// cache of objects for reuse; there are a set for each function so they don't get overwritten
	_sumForce: new Vec2(),
	_zeroVec: new Vec2(), // don't use
	
	seek: function(agent, dest) {
		if (dest.x === agent.position.x && dest.y === agent.position.y) {
			return this._zeroVec;
		}
		
		//Desired change of location
		var desired = dest.Copy().Subtract(agent.position());
		//Desired velocity (move there at maximum speed)
		desired.Multiply(agent.maxSpeed / desired.Length());
		//The velocity change we want
		var velocityChange = desired.Subtract(agent.velocity());
		//Convert to a force
		return velocityChange.Multiply(agent.maxForce / agent.maxSpeed);
	},
	
	separate: function(agent, flock) {
		var neighboursCount = 0;
		this._sumForce.x = 0;
		this._sumForce.y = 0;

		for (var i = 0; i < flock.length; i++) {
			var a = flock[i];
			if (a != agent) {
				var distance = agent.position().DistanceTo(a.position());
				if (distance < agent.minSeparation && distance > 0) {
					//Vector to other agent
					var pushForce = agent.position().Copy().Subtract(a.position());
					var length = pushForce.Normalize(); //Normalize returns the original length
					var r = (agent.radius + a.radius);

					this._sumForce.Add(pushForce.Multiply(1 - ((length - r) / (agent.minSeparation - r))));//agent.minSeparation)));
					//this._sumForce.Add(pushForce.Multiply(1 - (length / agent.minSeparation)));
					//this._sumForce.Add(pushForce.Divide(agent.radius));

					neighboursCount++;
				}
			}
		}

		if (neighboursCount == 0) {
			return this._zeroVec;
		}

		return this._sumForce.Multiply(agent.maxForce / neighboursCount);
	},
	
	cohere: function(agent, flock) {
		//Start with just our position
		//agent.position().Copy();
		this._sumForce.x = 0;
		this._sumForce.y = 0;
		var neighboursCount = 0;

		for (var i = 0; i < flock.length; i++) {
			var a = flock[i];
			if (a !== agent && a.group === agent.group) {
				var distance = agent.position.distanceTo(a.position);
				if (distance < agent.maxCohesion) {
					// sum up the position of our neighbors
					this._sumForce.add(a.position);
					neighboursCount++;
				}
			}
		}

		if (neighboursCount === 0) {
			return this._zeroVec;
		}

		// get the average position of ourself and our neighbors
		this._sumForce.divideScalar(neighboursCount);

		// seek that position
		return this.seek(agent, this._sumForce);
	},
	
	align: function(agent, flock) {
		var averageHeading = new B2Vec2();
		var neighboursCount = 0;

		//for each of our neighbours (including ourself)
		for (var i = 0; i < flock.length; i++) {
			var a = flock[i];
			var distance = agent.position().DistanceTo(a.position());
			//That are within the max distance and are moving
			if (distance < agent.maxCohesion && a.velocity().Length() > 0 && a.group == agent.group) {
				//Sum up our headings
				var head = a.velocity().Copy();
				head.Normalize();
				averageHeading.Add(head);
				neighboursCount++;
			}
		}

		if (neighboursCount == 0) {
			return averageHeading; //Zero
		}

		//Divide to get the average heading
		averageHeading.Divide(neighboursCount);

		//Steer towards that heading
		return steerTowards(agent, averageHeading);
	},
	
	steerTowards: function(agent, desiredDirection) {
		//Multiply our direction by speed for our desired speed
		var desiredVelocity = desiredDirection.Multiply(agent.maxSpeed);

		//The velocity change we want
		var velocityChange = desiredVelocity.Subtract(agent.velocity());
		//Convert to a force
		return velocityChange.Multiply(agent.maxForce / agent.maxSpeed);
	},
	
	
	/*-------------------------------------------------------------------------------
									COMPOSITE BEHAVIORS
	-------------------------------------------------------------------------------*/
	
	flock: function(agent) {
		//Work out our behaviours
		var ff = this.seek(agent, destinations[agent.group]);
		var sep = this.separate(agent);
		var alg = this.align(agent);
		var coh = this.cohere(agent);

		agent.forceToApply = ff.Add(sep.Multiply(1.2)).Add(alg.Multiply(0.3)).Add(coh.Multiply(0.05));

		var lengthSquared = agent.forceToApply.LengthSquared();
		if (lengthSquared > agent.maxForceSquared) {
			agent.forceToApply.Multiply(agent.maxForce / Math.sqrt(lengthSquared));
		}
	}
};

return Steering;

});