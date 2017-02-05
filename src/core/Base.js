/*
	All game objects must extend this, since many core components assume these properties exist on everything.
*/
mh.Base = function() {
	this.uniqueID = Math.random().toString(36).slice(2) + Date.now();
	this.active = false;
};
