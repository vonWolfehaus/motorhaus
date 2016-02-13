define(function(require) {

// imports
var Kai = require('core/Kai');

// states are disposed and nulled every transition
var TemplateState = {

	preload: function () {
		// load stuff...
	},

	create: function () {
		// instantiate entities stuff here
	},

	update: function () {
		// gets called every frame if not paused
	},

	dispose: function() {
		// null references and dispose anything created
	}
};

return TemplateState;

});