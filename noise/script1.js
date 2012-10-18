// <!-- noise Test 1, dimensition 1 every pixel-->

var visualCanvas = document.createElement("canvas");
var visualContext = visualCanvas.getContext('2d');

var graphCanvas = document.createElement("canvas");
var graphContext = graphCanvas.getContext("2d");

var visualContainer = document.createElement('div');
visualContainer.id = 'visualContainer';

var graphContainer = document.createElement('div');
graphContainer.id = "graphContainer";

var wd = 300;
var hg = 300;

$(function() {
	visualCanvas.width = 300;
	visualCanvas.height = 300;
	visualContainer.appendChild(visualCanvas);

	graphCanvas.width = 300;
	graphCanvas.height = 255;
	graphContainer.appendChild(graphCanvas);

	document.body.appendChild(visualContainer);
	document.body.appendChild(graphContainer);

	drawNoiseCanvas(visualContext);
});

function drawNoiseCanvas(cx) {
	var imgData = cx.createImageData(wd, hg);
	var visData = new Array();

	for (var x = 0; x < wd; x++) {
		var imgVal = Math.random() * 255;
		for (var y = 0; y < hg; y++) {

			imgData.data[(y * wd + x) * 4] = imgVal;
			imgData.data[(y * wd + x) * 4 + 1] = imgVal;
			imgData.data[(y * wd + x) * 4 + 2] = imgVal;
			imgData.data[(y * wd + x) * 4 + 3] = 255;

			visData[x] = imgVal;
		}
	}

	cx.putImageData(imgData, 0, 0);

	
	for(var x = 0; x < wd; x++){
		graphContext.beginPath();
		graphContext.moveTo(x, 255);
		graphContext.lineTo(x, 255-visData[x]);
		graphContext.stroke();
		
	}
	

}

