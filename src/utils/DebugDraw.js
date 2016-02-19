mh.debugDraw = {
	circle: function(ctx, x, y, radius, color) {
		color = color || 'rgb(200, 10, 30)';
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, mh.util.TAU);
		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.stroke();
	},
	point: function(ctx, p, radius, color) {
		color = color || 'rgb(200, 10, 30)';
		radius = radius || 3;
		ctx.beginPath();
		ctx.arc(p.x, p.y, radius, 0, mh.util.TAU);
		ctx.fillStyle = color;
		ctx.fill();
	},
	vector: function(ctx, v, offsetVec, color) {
		color = color || 'rgb(200, 10, 30)';
		ctx.beginPath();
		ctx.moveTo(offsetVec.x, offsetVec.y);
		ctx.lineTo(v.x + offsetVec.x, v.y + offsetVec.y);
		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.stroke();
	},
	vectorLine: function(ctx, fromV, toV, color) {
		color = color || 'rgb(200, 10, 30)';
		ctx.beginPath();
		ctx.moveTo(fromV.x, fromV.y);
		ctx.lineTo(toV.x, toV.y);
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
