var visualCanvas = document.createElement("canvas");
var visualContext = visualCanvas.getContext("2d");

var maxVal = 300;


$(function() {
	visualCanvas.width = visualCanvas.height = maxVal;
	document.body.appendChild(visualCanvas);

	visualContext.beginPath();

	visualContext.lineWidth = 1;
	visualContext.strokeStyle = "#ffffff";

	for (var x = 0; x < 300; x++) {
		// visualCanvas.fillStyle = "#ffffff";
		var valY = exponetialEasing(x);
		if (x == 0) {
			visualContext.moveTo(x, 300 - valY);
		} else {
			visualContext.lineTo(x, 300 - valY);
		}

	}
	visualContext.stroke();
	

});

