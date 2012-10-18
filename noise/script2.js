// <!-- noise Test 1, dimensition 1 every pixel-->

var visualCanvas = document.createElement("canvas");
var visualContext = visualCanvas.getContext('2d');

var graphCanvas = document.createElement("canvas");
var graphContext = graphCanvas.getContext("2d");

var visualContainer = document.createElement('div');
visualContainer.id = 'visualContainer';

var inputContainer = document.createElement("div");
inputContainer.id = "inputContainer";

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
	document.body.appendChild(inputContainer);
	document.body.appendChild(graphContainer);

	$("#firstname").css("margin-right", "20px");
	$("#inputContainer").css("margin-bottom", "20px");

	drawNoiseCanvas(visualContext);

	$("button#input").click(function() {
		var val = $("input#firstname").val();
		var numVal = parseInt(val);
		// console.log(val);
		redraw(numVal, visualContext, graphContext);
	});


});

function redraw(val, vCont, gCont) {
	console.log(val);
	vCont.clearRect(0, 0, wd, hg);
	var imgData = vCont.createImageData(wd, hg);
	var visData = new Array();

	var prevVal = Math.random() * 255;

	for (var x = 0; x < wd; x += val) {
		var nextVal = Math.random() * 255;
		for (var i = 0; i < val; i++) {
			for (var y = 0; y < hg; y++) {
				var imgVal = (1 - i / val) * prevVal + i / val * nextVal;

				imgData.data[(y * wd + x + i) * 4] = imgVal;
				imgData.data[(y * wd + x + i) * 4 + 1] = imgVal;
				imgData.data[(y * wd + x + i) * 4 + 2] = imgVal;
				imgData.data[(y * wd + x + i) * 4 + 3] = 255;

				visData[x +i] = imgVal;
			}
		}

		prevVal = nextVal;
	}

	vCont.putImageData(imgData, 0, 0);

	gCont.clearRect(0, 0, wd, hg);

	for (var x = 0; x < wd; x++) {
		gCont.beginPath();
		gCont.lineWidth = 1;
		gCont.strokeStyle = "#000000";

		// gCont.lineWidth(1);
		gCont.moveTo(x, 255);
		gCont.lineTo(x, 255 - visData[x]);
		gCont.stroke();

	}

}

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

	for (var x = 0; x < wd; x++) {
		graphContext.beginPath();
		graphContext.moveTo(x, 255);
		graphContext.lineTo(x, 255 - visData[x]);
		graphContext.stroke();

	}

}

