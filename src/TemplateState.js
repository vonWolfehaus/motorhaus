define(function(require) {

// imports
var Kai = require('core/Kai');

// states are disposed and nulled every transition
var TemplateState = {
	
	preload: function () {
		// load stuff...
		
		Kai.load.image('preloaderBackground', 'images/preloader_background.jpg');
	},

	create: function () {
		// instantiate entities stuff here
	},
	
	update: function () {
		
	},
	
	draw: function () {
		
	},
	
	dispose: function() {
		// null references and dispose anything created
	}
};

return TemplateState;

});