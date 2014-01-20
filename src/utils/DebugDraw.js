
define(function() {

var ctx = document.getElementById('debug').getContext('2d');
var DebugDraw = {
	circle: function(x, y, radius, color) {
		color = color || 'rgb(200, 10, 30)';
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI*2);
		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.stroke();
	},
	rectangle: function(x, y, sizeX, sizeY, color) {
		color = color || 'rgb(200, 10, 30)';
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.strokeRect(x - (sizeX*0.5), y - (sizeY*0.5), sizeX, sizeY);
	}
};

window.DebugDraw = DebugDraw;
return DebugDraw;
});