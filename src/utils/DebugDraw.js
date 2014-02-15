define(function() {
var tau = Math.PI*2;
var DebugDraw = {
	circle: function(ctx, x, y, radius, color) {
		color = color || 'rgb(200, 10, 30)';
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, tau);
		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.stroke();
	},
	point: function(ctx, p, color) {
		color = color || 'rgb(200, 10, 30)';
		ctx.beginPath();
		ctx.arc(p.x, p.y, 2, 0, tau);
		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.stroke();
	},
	rectangle: function(ctx, x, y, sizeX, sizeY, color) {
		color = color || 'rgb(200, 10, 30)';
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.strokeRect(x - (sizeX*0.5), y - (sizeY*0.5), sizeX, sizeY);
	}
};

return DebugDraw;
});
