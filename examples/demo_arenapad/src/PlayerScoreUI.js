define(function(require) {
	
// imports
var Kai = require('core/Kai');
// var ComponentType = require('components/ComponentDef');
// var Tools = require('utils/Tools');

// constructor
var PlayerScoreUI = function() {
	var board = Kai.scoreboard;
	
	this.elements = document.getElementsByClassName('status');
	
	board.onScoreChange.add(this._onScoreChange, this);
};


PlayerScoreUI.prototype = {
	constructor: PlayerScoreUI,
	
	/*-------------------------------------------------------------------------------
									PUBLIC
	-------------------------------------------------------------------------------*/
	
	dispose: function() {
		Kai.scoreboard.onScoreChange.add(this._onScoreChange, this);
		this.elements = null;
	},
	
	/*-------------------------------------------------------------------------------
									PRIVATE: EVENTS
	-------------------------------------------------------------------------------*/
	
	_onScoreChange: function(id, newScore) {
		this.elements[id].innerHTML = newScore;
	}
	
};

return PlayerScoreUI;

});