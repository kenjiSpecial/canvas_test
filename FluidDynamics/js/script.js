var wd;
var hg;

var frameWd;
var frameHg;

var resWd;
var resHg;
var field;window.onload = function(){
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");
	
	// alert("Wd: " + wd + ", Hg: " + hg);
	// alert("frameWd: " + frameWd + ", frameHg: " + frameHg);
	
	resWd = 134;
	resHg = 54;
	
	canvas.width = resWd;
	canvas.height = resHg;
	
	canvas.style.width = "1341px";
	canvas.style.height = "547px";
	// canvas.style.margin = (wd - frameWd)/2 + "px";
	// canvas.style.marginTop = (hg - frameHg)/2 + "px";
	
	field = new FluidField(canvas);
	field.setDisplayFunction(toggleDisplayFunction(canvas));
	field.setResolution(resWd, resHg)
	
	updateFrame();  
}

function updateFrame(){
	field.update();
	setInterval(updateFrame, 33);
}
