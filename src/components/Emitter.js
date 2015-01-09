var Kai = require('core/Kai');
var Tools = require('util/Tools');
var Pool = require('util/DualPool');
var Vec2 = require('math/Vec2');

/*
	A basic particle emitter: point and area emission, and a few dynamic force types.
	Does not require an entity.
 */
var Emitter = function(entity, settings) {
	require('core/Base').call(this);
	
	// adjustable properties available to override in settings
	this.width = 10; // setting a nice default
	this.height = 10;
	this.container = Kai.stage; // puts particles on top of everything
	this.blend = false;
	
	this.emitType = Emitter.EmitType.Point;
	this.emitDuration = -1; // how long to emit for, in seconds, or -1 for forever
	this.emitAngle = 0; // angle at which particles are emitted only in radians
	this.emitAngleVar = Tools.TAU; // "spread" of emission based around emitAngle in radians; default is full circle
	this.emitSpeed = 10;
	this.emitSpeedVar = 0;
	this.emitRate = 30; // how many per second
	
	this.particleDuration = 1; // in seconds
	this.particleDurationVar = 0;
	this.particleScaleInit = 1; // 0 - 1
	this.particleScaleVar = 0; // 0 - 1
	// this.particleScaleAccel = 1;
	
	this.particleAlphaInit = 1; // 0 - 1
	this.particleAlphaAccel = -2; // how fast to fade in (positive) or out (negative)
	this.particleAlphaAccelDelay = 0.5; // seconds to wait before applying alpha accel
	
	this.particleRotationAccel = 0; // particle sprite spin speed
	this.particleRotationAccelVar = 0.2; // randomize starting particle sprite rotation speed
	
	this.particleRadialAccel = 0;
	this.particleRadialAccelVar = 0;
	
	this.particleTangentialAccel = 0;
	this.particleTangentialAccelVar = 0;
	
	this.particleGravity = null;
	
	Tools.merge(this, settings);
	
	this.particleGravity = this.particleGravity || {x:0, y:0};
	
	// public
	this.entity = entity || null; // avoiding undefined
	this.duration = 0;
	this.position = new Vec2(); // get rid of Pixi's Point in favor of Vec2
	if (!this.uri) {
		throw new Error('[Emitter] You must pass in an image uri through the settings parameter');
	}
	this.texture = PIXI.Texture.fromImage(settings.uri);
	// this.texture.frame = new PIXI.Rectangle(this.offsetX, this.offsetY, this.width, this.height);
	
	// base
	this.uniqueId = Tools.generateID();
	this.active = false;
	
	// private
	this._force = new Vec2(); // aggregate force applied to each particle on update(), resets on each iteration, do not use
	this._vec = new Vec2(); // scratch Vec2 for update(), do not use
	this._emitTimer = 0;
	this._pool = new Pool(Particle, this, 15);
	this._emissionSum = 0;
};

// inherit from PIXI SpriteBatch
Emitter.prototype = Object.create(PIXI.SpriteBatch.prototype);
Emitter.prototype.constructor = Emitter;

// required statics for component system
Emitter.accessor = 'emitter'; // property name as it sits on an entity
Emitter.className = 'EMITTER'; // name of component on the definition list object
Emitter.priority = 50; // general position in the engine's component array; updated in ascending order


/*-------------------------------------------------------------------------------
									COMPONENT INTERFACE
-------------------------------------------------------------------------------*/

Emitter.prototype.activate = function() {
	this.active = true;
	this.container.addChild(this);
	this.visible = true;
	this.duration = 0;
	this._emissionSum = this.emitRate * Kai.elapsed;
};

Emitter.prototype.disable = function() {
	this.active = false;
	this.container.removeChild(this);
	this._pool.freeAll();
};

Emitter.prototype.update = function() {
	var i, p, o, l = this._pool.busy; // only loop through active particles
	
	this.duration += Kai.elapsed;
	if (this.emitDuration === -1 || this.duration < this.emitDuration) {
		// we can still emit
		this._emissionSum += this.emitRate * Kai.elapsed;
		if (this._emissionSum >= 1) {
			i = Math.floor(this._emissionSum);
			this.emit(i);
			this._emissionSum -= i;
		}
	}
	else {
		// we are done emitting but we need to wait until all particles finish
		if (this._pool.busy.length === 0) {
			this.disable();
			return;
		}
	}
	
	o = l.first;
	while (o) {
		p = o.obj; // update our active particles
		o = o.next;
		
		p.duration += Kai.elapsed;
		if (p.alpha < 0 || p.duration >= this.particleDuration) {
			p.visible = false; // no need to disable, it gets taken out of the busy list when recycled
			this._pool.recycle(p);
			continue;
		}
		
		if (p.fadeDelay <= 0) {
			p.alpha += this.particleAlphaAccel * Kai.elapsed;
		}
		else {
			p.fadeDelay -= Kai.elapsed;
		}
		
		this._vec.set(p.vx, p.vy); // normalized velocity
		this._force.copy(this._vec); // velocity
		
		this._force.multiplyScalar(p.radialAccel);
		
		this._vec.normalize();
		this._vec.perp();
		this._vec.multiplyScalar(p.tangentialAccel);
		// sum acceleration forces and integrate
		p.vx += (this._force.x + this._vec.x + this.particleGravity.x) * Kai.elapsed;
		p.vy += (this._force.y + this._vec.y + this.particleGravity.y) * Kai.elapsed;
		p.position.x += p.vx * Kai.elapsed;
		p.position.y += p.vy * Kai.elapsed;
		p.rotation += p.rotationAccel * Kai.elapsed;
	}
};

Emitter.prototype.dispose = function() {
	this.removeChildren();
	this.texture.destroy();
	this._pool.dispose();
	this._pool = null;
	this.forces = null;
};

/*-------------------------------------------------------------------------------
									PUBLIC
-------------------------------------------------------------------------------*/

Emitter.prototype.emit = function(amt) {
	var Type = Emitter.EmitType;
	var a, i, ii, p;
	// positions are relative to emitter (Pixi handles child coordinates)
	for (i = 0; i < amt; i++) {
		p = this._pool.get();
		p.activate();
		p.duration = Tools.random(this.particleDurationVar);
		p.rotation = Tools.random(this.particleRotationAccelVar * Tools.TAU);
		ii = this.particleScaleInit + Tools.random(this.particleScaleVar);
		p.scale.set(ii, ii);
		p.alpha = this.particleAlphaInit;
		p.fadeDelay = this.particleAlphaAccelDelay;
		p.blendMode = this.blend ? PIXI.blendModes.ADD : PIXI.blendModes.NORMAL;
		// velocity
		a = this.emitAngle + Tools.random(this.emitAngleVar);
		ii = this.emitSpeed + Tools.random(this.emitSpeedVar);
		p.vx = Math.cos(a) * ii;
		p.vy = -Math.sin(a) * ii;
		// forces
		p.radialAccel = this.particleRadialAccel + Tools.random(this.particleRadialAccelVar);
		p.tangentialAccel = this.particleTangentialAccel + Tools.random(this.particleTangentialAccelVar);
		p.rotationAccel = this.particleRotationAccel + Tools.random(this.particleRotationAccelVar);
		// position
		switch (this.emitType) {
			case Type.Rect:
				p.position.x = Tools.randomInt(this._width);
				p.position.y = Tools.randomInt(this._height);
				break;
			case Type.Circle:
				a = Math.random() * Tools.TAU;
				ii = Math.random();
				p.position.x = ii * this._width * Math.cos(a);
				p.position.y = ii * this._height * Math.sin(a);
				break;
			case Type.CircleUniform:
				a = Math.random() * Tools.TAU;
				ii = Math.sqrt(Math.random());
				p.position.x = ii * this._width * Math.cos(a);
				p.position.y = ii * this._height * Math.sin(a);
				break;
			case Type.Ring:
				a = Tools.random(Tools.TAU);
				p.position.x = Math.cos(a) * this._width;
				p.position.y = Math.sin(a) * this._height;
				break;
			default: // Point
				p.position.x = 0;
				p.position.y = 0;
				break;
		}
	}
};

/*-------------------------------------------------------------------------------
									STATIC
-------------------------------------------------------------------------------*/

Emitter.EmitType = {
	Point: 0,
	Rect: 2,
	Circle: 4,
	CircleUniform: 5,
	Ring: 6
};

/*-------------------------------------------------------------------------------
									PARTICLE
-------------------------------------------------------------------------------*/

/*
	The Emitter will instantiate these as necessary, so you only need to mess with the Emitter and it will efficiently apply it to its children.
 */
var Particle = function(parent) {
	PIXI.Sprite.call(this, parent.texture);
	this.uniqueId = Tools.generateID();
	
	parent.addChildAt(this, 0);
	this.anchor.set(0.5, 0.5);
	// TODO: frame either the whole sprite or if its width is greater than its height, choose random frame
	
	this.active = false;
	this.visible = false;
	this.duration = 0;
	this.fadeDelay = 0;
	this.vx = 0;
	this.vy = 0;
	this.radialAccel = 0;
	this.tangentialAccel = 0;
	this.rotationAccel = 0;
};

// inherit from PIXI Sprite
Particle.prototype = Object.create(PIXI.Sprite.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.activate = function() {
	// many of these are overwritten by the emitter when spawned
	this.active = true;
	this.visible = true;
	this.alpha = 1;
	this.duration = 0;
	this.rotation = 0;
	this.vx = 0;
	this.vy = 0;
	this.radialAccel = 0;
	this.tangentialAccel = 0;
	this.rotationAccel = 0;
};

Particle.prototype.disable = function() {
	this.active = false;
	this.visible = false;
};

module.exports = Emitter;
