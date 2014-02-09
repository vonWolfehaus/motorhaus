define(function(require) {
	
// imports
var Kai = require('core/Kai');

// constructor
var Scoreboard = function(numPlayers) {
	require('core/Base').call(this);
	
	numPlayers = numPlayers || 1;
	
	this.scores = [];
	
	this.highestScore = 0;
	this.highScorePlayer = 0;
	
	for (var i = 0; i < numPlayers; i++) {
		this.scores[i] = 0;
	}
	
	Kai.scoreboard = this;
	this.onScoreChange = new Signal();
};


Scoreboard.prototype = {
	constructor: Scoreboard,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	changeScore: function(playerId, points) {
		playerId = playerId || 0;
		this.scores[playerId] = this.scores[playerId] + points;
		this.onScoreChange.dispatch(playerId, this.scores[playerId]);
	},
	
	getScore: function(playerId) {
		playerId = playerId || 0;
		return this.scores[playerId];
	},
	
	crunchScores: function() {
		var i, player, high = Number.MIN_VALUE;
		
		for (i = 0; i < this.scores.length; i++) {
			if (this.scores[i] > high) {
				high = this.scores[i];
				player = i;
			}
		}
		
		this.highestScore = high;
		this.highScorePlayer = player;
		/*if (high === Number.MIN_VALUE) {
			return -1; // no one
		}*/
	},
	
	reset: function() {
		for (var i = 0; i < this.scores.length; i++) {
			this.scores[i] = 0;
		}
	},
	
	dispose: function() {
		this.scores = null;
	}
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	
	
};

return Scoreboard;

});