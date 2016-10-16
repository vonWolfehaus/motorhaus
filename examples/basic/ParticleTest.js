/* jshint ignore:start */

// imports
var Nexus = require('core/Nexus');
var Components = require('components/ComponentList');
var Enums = require('enums/EmitterEnums');
var Tools = require('util/Tools');

// states are disposed and nulled every transition
var ParticleTest = {
	
	preload: function () {
		// always return an array of asset URLs
		return ['./img/particle.png', './img/fire.png', './img/portal.png', './img/fountain.png', './img/snow.png'];
	},
	
	create: function () {
		// Nexus.world.setBounds();
		// Nexus.world.init();
		Nexus.debug = true;
		
		this.emitters = [];
		
		e = Nexus.addComponent(null, Components.EMITTER, Presets.fountain, this.emitters);
		e.position.set(300, 300);
		e.activate();
		
		e = Nexus.addComponent(null, Components.EMITTER, Presets.snow, this.emitters);
		e.position.set(1000, 100);
		e.activate();
		
		e = Nexus.addComponent(null, Components.EMITTER, Presets.portal, this.emitters);
		e.position.set(650, 450);
		e.activate();
		
		e = Nexus.addComponent(null, Components.EMITTER, Presets.galaxy, this.emitters);
		e.position.set(1000, 700);
		e.activate();
		
		e = Nexus.addComponent(null, Components.EMITTER, Presets.fire, this.emitters);
		e.position.set(300, 700);
		e.activate();
		
		console.log('ParticleTest created');
	},
	
	update: function () {
		
	},
	
	dispose: function() {
		// null references and dispose anything created
	}
};

// default values are commented out so you can focus on only what's different
var Presets = {
	galaxy: {
		uri: './img/particle.png',
		width: 20,
		height: 20,
		blend: true,
		emitType: Enums.EmitType.Circle,
		// emitDuration: -1,
		emitRate: 200,
		emitSpeed: 60,
		emitSpeedVar: 10,
		// emitAngle: 90 * Tools.DEG_TO_RAD,
		// emitAngleVar: 180 * Tools.DEG_TO_RAD,
		
		particleDuration: 2,
		particleDurationVar: 0,
		// particleAlphaAccel: -2,
		// particleAlphaAccelDelay: 0.5,
		particleScaleVar: 0.5,
		
		// particleRotationAccel: 2,
		// particleRotationAccelVar: 0.1,
		
		particleRadialAccel: 0.4,
		particleRadialAccelVar: 0.2,
		
		particleTangentialAccel: 180,
		particleTangentialAccelVar: 40,
		// particleGravity: {x:0, y:0}
	},
	portal: {
		uri: './img/portal.png',
		width: 80,
		height: 50,
		blend: true,
		emitType: Enums.EmitType.Ring,
		// emitDuration: -1,
		emitRate: 200,
		emitSpeed: 40,
		emitSpeedVar: 20,
		emitAngle: 90 * Tools.DEG_TO_RAD,
		emitAngleVar: 0 * Tools.DEG_TO_RAD,
		
		particleDuration: 2,
		// particleDurationVar: 0,
		particleAlphaAccel: -3,
		particleAlphaAccelDelay: 0.5,
		// particleScaleVar: 0,
		
		particleRotationAccel: 0,
		particleRotationAccelVar: 0,
		
		particleRadialAccel: 2,
		// particleRadialAccelVar: 0,
		
		// particleTangentialAccel: 0,
		// particleTangentialAccelVar: 0,
		particleGravity: {x:0, y:30}
	},
	fountain: {
		uri: './img/fountain.png',
		// width: 10,
		// height: 10,
		// blend: false,
		emitType: Enums.EmitType.CircleUniform,
		// emitDuration: -1,
		emitRate: 40,
		emitSpeed: 240,
		emitSpeedVar: 10,
		emitAngle: 90 * Tools.DEG_TO_RAD,
		emitAngleVar: 30 * Tools.DEG_TO_RAD,
		
		particleDuration: 2.5,
		// particleDurationVar: 0,
		// particleAlphaAccel: -2,
		particleAlphaAccelDelay: 2,
		particleScaleVar: 0.5,
		
		// particleRotationAccel: 2,
		// particleRotationAccelVar: 0.1,
		
		// particleRadialAccel: 0,
		// particleRadialAccelVar: 0,
		
		// particleTangentialAccel: 0,
		// particleTangentialAccelVar: 0,
		particleGravity: {x:0, y:250}
	},
	fire: {
		uri: './img/fire.png',
		width: 30,
		height: 20,
		blend: true,
		emitType: Enums.EmitType.Circle,
		// emitDuration: -1,
		emitRate: 100,
		emitSpeed: 100,
		emitSpeedVar: 10,
		emitAngle: 90 * Tools.DEG_TO_RAD,
		emitAngleVar: 0 * Tools.DEG_TO_RAD,
		
		particleDuration: 1.5,
		particleDurationVar: 1,
		particleAlphaAccel: -1.5,
		// particleAlphaAccelDelay: 0.5,
		particleScaleVar: 0.5,
		
		// particleRotationAccel: 0,
		particleRotationAccelVar: 0.2,
		
		// particleRadialAccel: 0,
		// particleRadialAccelVar: 0,
		
		// particleTangentialAccel: 0,
		// particleTangentialAccelVar: 0,
		particleGravity: {x:0, y:-50}
	},
	fire2: {
		uri: './img/fire.png',
		width: 20,
		height: 20,
		blend: true,
		emitType: Enums.EmitType.Circle,
		// emitDuration: -1,
		emitRate: 100,
		emitSpeed: 40,
		emitSpeedVar: 10,
		emitAngle: 90 * Tools.DEG_TO_RAD,
		emitAngleVar: 50 * Tools.DEG_TO_RAD,
		
		particleDuration: 1.5,
		particleDurationVar: 1,
		particleAlphaAccel: -1.5,
		// particleAlphaAccelDelay: 0.5,
		particleScaleVar: 0.5,
		
		particleRotationAccel: 3,
		particleRotationAccelVar: 0.5,
		
		// particleRadialAccel: 0,
		// particleRadialAccelVar: 0,
		
		// particleTangentialAccel: 0,
		// particleTangentialAccelVar: 0,
		particleGravity: {x:0, y:-70}
	},
	snow: {
		uri: './img/snow.png',
		width: 300,
		height: 1,
		// blend: false,
		emitType: Enums.EmitType.Rect,
		// emitDuration: -1,
		emitRate: 30,
		emitSpeed: 50,
		emitSpeedVar: 30,
		emitAngle: 270 * Tools.DEG_TO_RAD,
		emitAngleVar: 0 * Tools.DEG_TO_RAD,
		
		particleDuration: 2,
		// particleDurationVar: 0,
		// particleAlphaAccel: -2,
		particleAlphaAccelDelay: 1.5,
		particleScaleVar: 0.5,
		
		particleRotationAccel: 0,
		particleRotationAccelVar: 3,
		
		// particleRadialAccel: 0.4,
		particleRadialAccelVar: 0.2,
		
		// particleTangentialAccel: 0,
		// particleTangentialAccelVar: 0,
		particleGravity: {x:0, y:50}
	}
};

module.exports = ParticleTest;
