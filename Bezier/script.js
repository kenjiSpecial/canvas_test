var viewCanvas = document.createElement('canvas');
var viewCntx = viewCanvas.getContext("2d");

var p1 = {
	x : 200,
	y : 100
};
var p2 = {
	x : 800,
	y : 100
};
var p3 = {
	x : 500,
	y : 120
};

var pts = [p1, p2, p3];

var wd;
var hg;

$(function() {
	viewCanvas.width = window.innerWidth;
	viewCanvas.height = window.innerHeight;

	wd = window.innerWidth;
	hg = window.innerHeight;

	document.body.appendChild(viewCanvas);
	console.log(pts.length);

	draw()

});

$(window).mousemove(function(event) {
	// console.log("call");
	// var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
	// var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
	// console.log(pageCoords);
	// console.log(clientCoords);
	var ptX = event.pageX;

	viewCntx.clearRect(0, 0, wd, hg);

	draw()
	drawPt(ptX);
});

//-----------------------------------------------

function draw() {
	viewCntx.fillStyle = "#ffffff";
	viewCntx.beginPath();
	for (var i = 0; i < pts.length; i++) {
		viewCntx.arc(pts[i].x, pts[i].y, 5, 0, Math.PI * 2, true);
	};

	viewCntx.closePath();
	viewCntx.fill()

	viewCntx.strokeStyle = "#ffffff";
	viewCntx.lineWidth = 2;
	viewCntx.beginPath();
	viewCntx.moveTo(pts[0].x, pts[0].y);
	viewCntx.lineTo(pts[2].x, pts[2].y);
	viewCntx.stroke();
	viewCntx.closePath();

	viewCntx.strokeStyle = "#ffffff";
	viewCntx.lineWidth = 2;
	viewCntx.beginPath();
	viewCntx.moveTo(pts[1].x, pts[1].y);
	viewCntx.lineTo(pts[2].x, pts[2].y);
	viewCntx.stroke();
	viewCntx.closePath();

}

function drawPt(ptVal) {
	var t = ptVal / wd;

	var pt1x = (1 - t) * p1.x + t * p3.x;
	var pt1y = (1 - t) * p1.y + t * p3.y;

	var pt2x = (1 - t) * p3.x + t * p2.x;
	var pt2y = (1 - t) * p3.y + t * p2.y;

	var ptBezX = (1 - t) * pt1x + t * pt2x;
	var ptBezY = (1 - t) * pt1y + t * pt2y;

	//---------------------------------------
	//---------------------------------------

	viewCntx.beginPath();
	viewCntx.fillStyle = "#999999";
	viewCntx.arc(pt1x, pt1y, 5, 0, Math.PI * 2, true);
	viewCntx.arc(pt2x, pt2y, 5, 0, Math.PI * 2, true);

	viewCntx.closePath();
	viewCntx.fill()

	viewCntx.beginPath();

	viewCntx.fillStyle = "#ff0000";
	viewCntx.arc(ptBezX, ptBezY, 5, 0, Math.PI * 2, true);

	viewCntx.closePath();
	viewCntx.fill()

	//---------------------------------------

	viewCntx.strokeStyle = "#999999";
	viewCntx.lineWidth = 2;

	viewCntx.beginPath();

	viewCntx.moveTo(pt1x, pt1y);
	viewCntx.lineTo(pt2x, pt2y);

	viewCntx.stroke();
	viewCntx.closePath();

}

