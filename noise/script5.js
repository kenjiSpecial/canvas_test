// <!-- noise Test 1, dimensition 1 every pixel-->

var visualCanvasArr = [];
var visualContextArr = [];

var graphCanvasArr = [];
var graphContextArr = [];

var perlinImgData = [];
for (var i = 0; i < 300; i++) {
	perlinImgData[i] = 0;
}
console.log(perlinImgData[0]);

for (var i = 0; i < 7; i++) {
	visualCanvasArr[i] = document.createElement("canvas");
	visualContextArr[i] = visualCanvasArr[i].getContext("2d");

	graphCanvasArr[i] = document.createElement("canvas");
	graphContextArr[i] = graphCanvasArr[i].getContext("2d");
}

var finalVisualCanvas = document.createElement("canvas");
var finalVisualContext = finalVisualCanvas.getContext("2d");

var finalGraphCanvas = document.createElement("canvas");
var finalGraphContext = finalGraphCanvas.getContext("2d");

// ------------------------------------------------------

var visualContainer = document.createElement('div');
visualContainer.id = 'visualContainer';

var graphContainer = document.createElement('div');
graphContainer.id = "graphContainer";

// ------------------------------------------------------

var wd = 300;
var hg = 300;

var shindo = 128;
var aveVal = 128;

// ------------------------------------------------------

var Persistence = 1;
var PersistenceSum = 0;
// frequency = 2 weave_num
var amptitude;
// amplitude = persistence i
var freq = 2;
var weave_num = 0;

// ------------------------------------------------------

$(function() {

	// console.log(perlinImgData[0]);

	finalVisualCanvas.width = 300;
	finalVisualCanvas.height = 300;

	finalGraphCanvas.width = 300;
	finalGraphCanvas.height = 255;

	visualContainer.appendChild(finalVisualCanvas);
	graphContainer.appendChild(finalGraphCanvas);

	// 	---------------------------------------------------

	for (var i = 0; i < visualContextArr.length; i++) {

		visualCanvasArr[i].width = 300;
		visualCanvasArr[i].height = 300;
		visualContainer.appendChild(visualCanvasArr[i]);

		graphCanvasArr[i].width = 300;
		graphCanvasArr[i].height = 255;
		graphContainer.appendChild(graphCanvasArr[i]);
	}

	// 	---------------------------------------------------

	document.body.appendChild(visualContainer);
	document.body.appendChild(graphContainer);

	for (var i = 0; i < visualContextArr.length; i++) {
		drawIt(visualContextArr[i], graphContextArr[i], i);
	}

	console.log("");
	console.log("PersistenceSum: " + PersistenceSum);
	console.log(perlinImgData[0]);

	var visData = finalVisualContext.createImageData(wd, hg);
	for (var x = 0; x < wd; x++) {
		for (var y = 0; y < hg; y++) {
			var val = Math.round(perlinImgData[x] / PersistenceSum);
			visData.data[(x + wd * y) * 4] = val;
			visData.data[(x + wd * y) * 4 + 1] = val;
			visData.data[(x + wd * y) * 4 + 2] = val;
			visData.data[(x + wd * y) * 4 + 3] = val;
		}
	}
	finalVisualContext.putImageData(visData, 0, 0);
	
	for (var x = 0; x < perlinImgData.length; x++) {
		finalGraphContext.beginPath();
		finalGraphContext.lineWidth = 1;
		finalGraphContext.strokeStyle = "#ffffff";
		finalGraphContext.moveTo(x, 255);
		finalGraphContext.lineTo(x, 255 - perlinImgData[x]/PersistenceSum);
		finalGraphContext.stroke();
	}
	

});

function drawIt(visCtx, graCtx, num) {
	num = parseInt(num);

	freq = Math.pow(2, num);
	amptitude = Math.pow(Persistence, num);
	PersistenceSum += amptitude;
	console.log("");
	console.log("num: " + num + ", freq: " + freq + ", amptitude: " + amptitude);

	// 	========================================

	var randomData = [];

	for (var i = 0; i < freq + 1; i++) {
		randomData[i] = shindo * amptitude * (2 * Math.random() - 1) + aveVal;
		console.log("randomData[" + i + "]: " + randomData[i]);
	}
	// console.log("randomData:"+ randomData[0]);

	var reRandomData = [];

	for (var i = 0; i < randomData.length; i++) {
		if (i == 0) {
			reRandomData[i] = randomData[i] / 4 * 3 + randomData[i + 1] / 4;
		} else if (i == randomData.length - 1) {
			reRandomData[i] = randomData[i] / 4 * 3 + randomData[i - 1] / 4;
		} else {
			reRandomData[i] = randomData[i] / 2 + randomData[i - 1] / 4 + randomData[i + 1] / 4;
		}
	}

	console.log("reRandomData:" + reRandomData[0]);

	// 	========================================

	var InterData = new Array();
	var interval = Math.ceil(wd / freq);

	// console.log("interval: " + interval);
	var count = 0;

	for (var x = 0; x < wd; x += interval) {
		for (var i = 0; i < interval; i++) {
			var rate = i / interval;
			var ft = rate * Math.PI;
			var f = (1 - Math.cos(ft)) * .5;

			InterData[i + x] = reRandomData[count] * (1 - f) + reRandomData[count + 1] * f;

		}
		count += 1;
	}



	var imgData = visCtx.createImageData(wd, hg);
	for (var x = 0; x < wd; x++) {
		perlinImgData[x] = perlinImgData[x] + Math.round(InterData[x]) * amptitude;
		// dataArray[x] += 2 ;

		for (var y = 0; y < hg; y++) {
			imgData.data[(y * wd + x) * 4] = Math.round(InterData[x]);
			imgData.data[(y * wd + x) * 4 + 1] = Math.round(InterData[x]);
			imgData.data[(y * wd + x) * 4 + 2] = Math.round(InterData[x]);
			imgData.data[(y * wd + x) * 4 + 3] = Math.round(InterData[x]);
		}
		

	}

	console.log(perlinImgData[0]);
	visCtx.putImageData(imgData, 0, 0);

	for (var x = 0; x < InterData.length; x++) {
		graCtx.beginPath();
		graCtx.lineWidth = 1;
		graCtx.strokeStyle = "#ffffff";
		graCtx.moveTo(x, 255);
		graCtx.lineTo(x, 255 - InterData[x]);
		graCtx.stroke();
	}

}