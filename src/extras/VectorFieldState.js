/*

	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
mh.VectorFieldState = function(entity) {
	this.uuid = mh.util.generateID();

	this.fieldID = -1; // flow field index (as it sits in the array)
	this.reachedGoal = true;

	mh.kai.addComponent(entity, mh.Component.FLOCK, mh.Flock);

	// shared references
	var _position = entity.position,
		_vecField = mh.kai.flow;

	// internal settings
	// always best to use a timer to spread out the processing for expensive ops, especially when the user won't notice it
	var _pollTime = 12,
		_timer = Math.ceil(Math.random() * _pollTime);


	this.update = function() {
		var node;
		_timer--;
		if (_timer < 0 && !this.reachedGoal) {
			_timer = _pollTime;

			if (_position.distanceTo(mh.kai.flow.goalPixels) < 100) {
				// console.log('reached goal');
				this.reachedGoal = true;
			}
			else {
				node = entity.flock.nearby.first;
				while (node) {
					if (!node.obj.vecFieldState) {
						node = node.next;
						continue;
					}

					if (node.obj.vecFieldState.reachedGoal) {
						// console.log('neighbor reached goal');
						this.reachedGoal = true;
						break;
					}
					node = node.next;
				}
			}
		}

		return _vecField.getVectorAt(_position, this.fieldID);
	};

	this.destroy = function() {
		_vecField = null;
		_position = null;
		entity = null;
	};
};
