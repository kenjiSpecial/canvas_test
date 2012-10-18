var canvas;
// var context;
var field;
var fieldres;

var res;
var displaySIze = 512;


window.onload = function(){
	// alert("onload");
	canvas = document.getElementById("myCanvas");
	field = new FluidField(canvas);
	
	// field.setUICallback(prepareFrame);
	var r = 64;
	canvas.width = r;
	canvas.height = r;
	fieldRes = r;
	field.setResolution(r,r);
	
	// console.log("field.setDisplayFunction(toggleDisplayFunction)")
	
	field.setDisplayFunction(toggleDisplayFunction(canvas)); //"toggleDisplayFunction");
	// startAnimation();
	updateFrame();
}

function updateFrame(){
	// console.log("updateFrame");
	field.update();
	
	setTimeout( updateFrame, 10);
}
