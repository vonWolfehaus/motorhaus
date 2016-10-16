/*
	A "communications tower", or global collection of signals that are integral to the operation of the engine.
*/
mh.tower = {
	requestState: new mh.Signal(),
	pause: new mh.Signal(),
	resume: new mh.Signal()
};
