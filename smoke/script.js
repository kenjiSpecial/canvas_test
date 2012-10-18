var particles = [];

var posX, posY;
var count = 0;

var viewCanvas = document.createElement("canvas");

var maxVal = 30;
var cloudObj;

$(function() {

	posX = 400; 
	posY = 400;

	viewCanvas.width = window.innerWidth;
	viewCanvas.height = window.innerHeight;

	document.body.appendChild(viewCanvas);

	var chokei = 100;
	
	for(var i = 0; i < 8; i++){
	var choR = 10 + 10 * i; //Math.round( 140 * Math.sqrt( (i + 1) /8) );
	cloudObj = new cloud(viewCanvas, Math.round( posX - choR/2 ) , Math.round(posY - choR * i * .3), choR, 60);
	}
	
	// -------------------------------
	
	// var choR = 200;
	// cloudObj = new cloud(viewCanvas,  0, 0, 200, 100);

	// setInterval(loop, 1000 / 30);

});

function loop() {
	posX += 1;
	posY += 1;
	cloudObj.update(posX, posY);
}

