define(function(require) {
	
// imports
var Kai = require('core/Kai');
// var Tools = require('utils/Tools');

/**
 * @constructor
 * @param {int} [width] - The width of the canvas in pixels.
 * @param {int} [height] - The height of the canvas in pixels.
 */
var KamiRenderer = function(sceneTextureURL, width, height) {
	// attributes
	this.canvas = null;
	this.sprites = new LinkedList();
	
	this.ctx = new Kami.WebGLContext(width, height);
	this.batch = new Kami.SpriteBatch(this.ctx);
	this.texture = new Texture(this.ctx, sceneTextureURL, this.ready.bind(this));
	
	Kai.width = width || null;
	Kai.height = height || null;
	
    document.body.appendChild(this.ctx.view);
};

KamiRenderer.prototype = {
	constructor: KamiRenderer,
	
	add: function(s) {
		this.sprites.add(s);
	},
	
	ready: function() {
		this.active = true;
	},
	
	reset: function() {
		
	},
	
	update: function() {
		var i, gl = this.ctx.gl;
		this.ctx.gl.clear(gl.COLOR_BUFFER_BIT);
		this.batch.begin();
		for (i = 0; i < this.sprites.length; i++) {
			s = this.sprites[i];
			if (s.active) {
				s.draw(this.batch);
			}
		}
		batch.draw(this.texture, 0, 0, this.ctx.width, this.ctx.height);
        batch.end();
	},
	
	dispose: function() {
		this.canvas = null;
		this.ctx = null;
	}
};

return KamiRenderer;

});