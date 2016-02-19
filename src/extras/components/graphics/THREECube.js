mh.THREECube = function(entity, settings) {
	settings = settings || {};
	mh.Base.call(this);
	var config = {
		textureUrl: 'img/square-outline-textured.png',
		container: mh.kai.view,
		size: 50,
		dynamic: false,
		color: 0xfeb74c
	};
	// attribute override
	config = mh.util.merge(config, settings);

	// attributes
	this.textureUrl = config.textureUrl;
	this.container = config.container;
	this.size = config.size;
	this.dynamic = config.dynamic;
	this.color = config.color;

	// private properties
	this.entity = entity;
	this._display = null;

	// NEVER do this in production! geo and materials should be cached!
	// But I'm on vacation and this is prototype code so, meh
	var cubeGeo = new THREE.CubeGeometry(this.size, this.size, this.size);
	var cubeMaterial = new THREE.MeshLambertMaterial({
		color: this.color,
		ambient: this.color,
		shading: THREE.FlatShading,
		map: this.dynamic ? null : THREE.ImageUtils.loadTexture(this.textureUrl)
	});

	this._display = new THREE.Mesh(cubeGeo, cubeMaterial);

	if (!this.dynamic) {
		this._display.matrixAutoUpdate = false;
		this._display.position.copy(entity.position);
		this._display.updateMatrix();
	}

	// prerequisite components
	this.position = entity.position;
};

// required statics for component system
mh.THREECube.accessor = 'view'; // property name as it sits on an entity
mh.THREECube.className = 'VIEW_CUBE'; // name of component on the mh.Component object
mh.THREECube.priority = 10; // general position in the engine's component array; highest updated first

mh.THREECube.prototype = {
	constructor: mh.THREECube,

	activate: function() {
		this.active = true;
		this.container.add(this._display);
	},

	disable: function() {
		this.active = false;
		this.container.remove(this._display);
	},

	update: function() {
		this._display.position.x = this.position.x;
		this._display.position.y = this.position.y;
		this._display.position.z = this.position.z;
	},

	dispose: function() {
		this.disable();

		// null references
		this.entity = null;
		this.position = null;
		this._display = null; // if you don't dispose() THREE Geometry, you'll get memory leaks FYI
	}
};
