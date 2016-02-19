/*
	Singleton/POJO that describes the physical properties of any given game world,
	as well as references to common objects.
*/
mh.world = {
	width: 1,
	height: 1,
	depth: 1,

	scale: 1,
	gravity: 8,
	friction: 0.98,

	elapsed: 0.01666,

	broadphase: null,
	map: null,

	mainCamera: null,
	cameras: null
};
