// <!-- noise Test 1, dimensition 1 every pixel-->

var visualCanvas = document.createElement("canvas");
var visualContext = visualCanvas.getContext('2d');

var visual2Canvas = document.createElement("canvas");
var visual2Context = visual2Canvas.getContext('2d');

var visual3Canvas = document.createElement("canvas");
var visual3Context = visual3Canvas.getContext('2d');

// ------------------------------------------------------

var graphCanvas = document.createElement("canvas");
var graphContext = graphCanvas.getContext("2d");

var graph2Canvas = document.createElement("canvas");
var graph2Context = graph2Canvas.getContext("2d");

var graph3Canvas = document.createElement("canvas");
var graph3Context = graph3Canvas.getContext("2d");

// ------------------------------------------------------

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

	visual2Canvas.width = 300;
	visual2Canvas.height = 300;
	visualContainer.appendChild(visual2Canvas);

	visual3Canvas.width = 300;
	visual3Canvas.height = 300;
	visualContainer.appendChild(visual3Canvas);

	graphCanvas.width = 300;
	graphCanvas.height = 255;
	graphContainer.appendChild(graphCanvas);

	graph2Canvas.width = 300;
	graph2Canvas.height = 255;
	graphContainer.appendChild(graph2Canvas);

	graph3Canvas.width = 300;
	graph3Canvas.height = 255;
	graphContainer.appendChild(graph3Canvas);

	document.body.appendChild(visualContainer);
	document.body.appendChild(graphContainer);

	// drawNoiseCanvas(visualContext);
	draw(10, visualContext, graphContext);

});

function draw(val, vCont, gCont) {
	console.log(val);
	vCont.clearRect(0, 0, wd, hg);
	var imgData = vCont.createImageData(wd, hg);
	var visData = new Array();

	var prevVal = Math.random() * 255;
	var count = 0;

	for (var x = 0; x <= wd; x += val) {
		var nextVal = Math.random() * 255;
		visData[count] = nextVal;

		for (var y = 0; y < hg; y++) {
			var imgVal = nextVal;

			imgData.data[(y * wd + x) * 4] = imgVal;
			imgData.data[(y * wd + x) * 4 + 1] = imgVal;
			imgData.data[(y * wd + x) * 4 + 2] = imgVal;
			imgData.data[(y * wd + x) * 4 + 3] = 255;

		}

		prevVal = nextVal;
		count++;
	}

	vCont.putImageData(imgData, 0, 0);

	for (var x = 0; x < visData.length; x++) {
		gCont.beginPath();
		gCont.lineWidth = 1;
		gCont.strokeStyle = "#000000";
		// console.log("x: "+ x * val);

		// gCont.lineWidth(1);
		gCont.moveTo(x * val, 255);
		gCont.lineTo(x * val, 255 - visData[x]);
		gCont.stroke();
	}

	redraw(val, visData);
}

function redraw(val, visData) {

	var reVisData = [];
	console.log("visData: " + visData.length);

	for (var i = 0; i < visData.length; i++) {

		if (i == 0) {
			reVisData[i] = visData[i] / 4 * 3 + visData[i + 1] / 4;
		} else if (i == visData.length - 1) {
			reVisData[i] = visData[i] / 4 * 3 + visData[i - 1] / 4;
		} else {
			reVisData[i] = visData[i] / 2 + visData[i - 1] / 4 + visData[i + 1] / 4;
		}

	}

	var imgReData = visual2Context.createImageData(wd, hg);
	var count = 0;
	for (var x = 0; x <= wd; x += val) {

		for (var y = 0; y < hg; y++) {

			imgReData.data[(y * wd + x) * 4] = reVisData[count];
			imgReData.data[(y * wd + x) * 4 + 1] = reVisData[count];
			imgReData.data[(y * wd + x) * 4 + 2] = reVisData[count];
			imgReData.data[(y * wd + x) * 4 + 3] = 255;

		}

		count++;
	}

	visual2Context.putImageData(imgReData, 0, 0);

	for (var x = 0; x < visData.length; x++) {
		graph2Context.beginPath();
		graph2Context.lineWidth = 1;
		graph2Context.strokeStyle = "#000000";
		graph2Context.moveTo(x * val, 255);
		graph2Context.lineTo(x * val, 255 - reVisData[x]);
		graph2Context.stroke();
	}

	redraw2(val, reVisData);
}

function redraw2(val, data) {
	console.log(data.length);
	var rereVisData = [];
	console.log("val: " + val);
	console.log("data[0]: " + data[0]);

	var count = 0;

	for (var i = 0; i < data.length - 1; i++) {

		for (var j = 0; j < 10; j++) {

			var rate = j / 10;
			// var val = (1 - rate) * data[i] + rate * data[i + 1];
			var ft = rate * Math.PI;
			var f = (1 - Math.cos(ft)) * .5;
			
			var val = (1 - f) * data[i] + f * data[i + 1];

			rereVisData[(i * 10 + j)] = val;
		}

	}

	var imgReData = visual3Context.createImageData(wd, hg);

	for (var x = 0; x < wd; x++) {

		for (var y = 0; y < hg; y++) {

			imgReData.data[(y * wd + x) * 4] = Math.round(rereVisData[x]);
			imgReData.data[(y * wd + x) * 4 + 1] = Math.round(rereVisData[x]);
			imgReData.data[(y * wd + x) * 4 + 2] = Math.round(rereVisData[x]);
			imgReData.data[(y * wd + x) * 4 + 3] = 255;

		}

	}

	visual3Context.putImageData(imgReData, 0, 0);

	for (var x = 0; x < rereVisData.length; x++) {
		graph3Context.beginPath();
		graph3Context.lineWidth = 1;
		graph3Context.strokeStyle = "#000000";
		graph3Context.moveTo(x, 255);
		graph3Context.lineTo(x, 255 - rereVisData[x]);
		graph3Context.stroke();
	}
	
	perlinNoise(rereVisData);
}


function perlinNoise(visualData){
	
}



