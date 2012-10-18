var frames = 0;
var force = 5;
var source = 100;
var omx, omy;
var mx, my;
var mouseIsDown = false;
var displaySizeX = 1350;
var displaySizeY = 550;

var resX = 270;
var resY = 110;

var canvas;

var field;

function prepareFrame(field) {

	// omx = 600;
	// omy = 100;
	// mx = 600;
	// my = 101;

	var dx = 0;
	var dy = 5;

	var x = 135;
	var y = 105;

	// var length = (Math.sqrt(dx * dx + dy * dy) + 0.5) | 0;
	// // console.log("length: " + length);
	// if (length < 1)
	// length = 1;
	//
	//
	//
	// for (var i = 0; i < length; i++) {
	// var x = (((omx + dx * (i / length)) / displaySizeX) * field.width()) | 0
	// var y = (((omy + dy * (i / length)) / displaySizeY) * field.height()) | 0;
	//
	// console.log("x, y" + x + ", " + y);
	// console.log("field width, height: " + field.width() + ", " + field.height());
	//
	field.setVelocity(x, y, dx, dy);
	field.setDensity(x, y, 100);

	//
	// omx = mx;
	// omy = my;
	// }

}

function updateFrame() {
	field.update();
	field.setCheckValue(true);
	// field.checkLog();

	 interval = setTimeout(updateFrame, 10);
}

window.onload = function() {
	canvas = document.getElementById("canvas");
	canvas.onclick = function(){
	updateFrame();
	}
	// $("#canvas").keypress(function() {
		// alert('Handler for .keydown() called.');
	// });

	field = new FluidField(canvas);

	field.setUICallback(prepareFrame);

	canvas.width = resX;
	canvas.height = resY;
	field.setResolution(resX, resY);

	field.setDisplayFunction(toggleDisplayFunction(canvas));
	// updateFrame();
}