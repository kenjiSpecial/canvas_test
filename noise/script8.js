// <!-- noise Test 1, dimensition 1 every pixel-->

var wd = 300;
var hg = 300;

// ------------------------------------------------------

var visualCanvasArr = [];
var visualContextArr = [];

var perlinImgData = [];
for (var i = 0; i < 300; i++) {
	perlinImgData[i] = new Array(300);
	for (var j = 0; j < 300; j++) {
		perlinImgData[i][j] = 0;
	}
}
// console.log(perlinImgData[0]);

for (var i = 0; i < 7; i++) {
	visualCanvasArr[i] = document.createElement("canvas");
	visualContextArr[i] = visualCanvasArr[i].getContext("2d");
}

var finalVisualCanvas = document.createElement("canvas");
var finalVisualContext = finalVisualCanvas.getContext("2d");

// ------------------------------------------------------

var visualContainer = document.createElement('div');
visualContainer.id = 'visualContainer';

// ------------------------------------------------------

var shindo = 128;
var aveVal = 128;

// ------------------------------------------------------

var Persistence = .9;
var PersistenceSum = 0;
// frequency = 2 weave_num
var amptitude;
// amplitude = persistence i
var freq = 2;
var weave_num = 0;

$(function() {

	finalVisualCanvas.width = wd;
	finalVisualCanvas.height = hg;

	visualContainer.appendChild(finalVisualCanvas);

	for (var i = 0; i < visualCanvasArr.length; i++) {
		visualCanvasArr[i].width = wd;
		visualCanvasArr[i].height = hg;
		visualContainer.appendChild(visualCanvasArr[i]);
	}

	document.body.appendChild(visualContainer);

	// 	--------------------------------------------------------

	for (var i = 0; i < visualCanvasArr.length; i++) {
		drawIt(visualContextArr[i], i);
	}

	var visData = finalVisualContext.createImageData(wd, hg);
	for (var x = 0; x < wd; x++) {
		for (var y = 0; y < hg; y++) {
			var val = Math.round(perlinImgData[x][y] / PersistenceSum);
			visData.data[(x + wd * y) * 4] = cloudExpCurve(val);
			visData.data[(x + wd * y) * 4 + 1] = cloudExpCurve(val);
			visData.data[(x + wd * y) * 4 + 2] = cloudExpCurve(val);
			visData.data[(x + wd * y) * 4 + 3] = cloudExpCurve(val);
			if (x == 0) {
				console.log(cloudExpCurve(val));
			}
		}
	}
	finalVisualContext.putImageData(visData, 0, 0);

});

var cloudCover = 100;
var cloudSharpness = .99;

function cloudExpCurve(v) {

	if (cloudCover > 0) {

		var c = v - cloudCover;
		if (c < 0)
			c = 0;

	}

	var cloudDensity = 255 - Math.pow(cloudSharpness, c) * 255;

	return cloudDensity
}

function drawIt(visCtx, num) {
	num = parseInt(num);

	freq = Math.pow(2, num);
	amptitude = Math.pow(Persistence, num);
	PersistenceSum += amptitude;
	console.log("");
	console.log("num: " + num + ", freq: " + freq + ", amptitude: " + amptitude);

	// 	--------------------------------------------------------

	var randomData = new Array(freq);
	for (var i = 0; i < freq + 1; i++) {
		randomData[i] = new Array(freq);

		for (var j = 0; j < freq + 1; j++) {
			randomData[i][j] = shindo * amptitude * (2 * Math.random() - 1) + aveVal;
		}

	}

	// for (var i = 0; i < randomData.length; i++) {
	// var str = "";
	// for (var j = 0; j < randomData[i].length; j++) {
	// if ( j == 0) {
	// str +=  Math.round(randomData[i][j]);
	// } else {
	// str += ", " + Math.round(randomData[i][j]);
	// }
	//
	// }
	// console.log(str);
	// }

	var interval = Math.ceil(wd / freq);
	var perlinRowData = new Array(wd);
	for (var i = 0; i < wd; i++) {
		perlinRowData[i] = new Array(hg);
	}

	var countX = 0;
	var countY;

	for (var x = 0; x < wd; x += interval) {
		// perlinRowData[x] = new Array(hg);
		countY = 0;

		for (var y = 0; y < hg; y += interval) {

			//--------------------------------------------
			var str = "";

			for (var smX = 0; smX < interval; smX++) {

				var rateX = smX / interval;
				var ft_X = rateX * Math.PI;
				var f_X = (1 - Math.cos(ft_X) ) * .5;

				for (var smY = 0; smY < interval; smY++) {
					if ((x + smX) < 300 && (y + smY) < 300) {
						var rateY = smY / interval;
						var ft_Y = rateY * Math.PI;
						var f_Y = (1 - Math.cos(ft_Y)) * .5;

						var vx0vy0 = randomData[countX][countY];
						var vx1vy0 = randomData[countX + 1][countY];

						var vx0vy1 = randomData[countX][countY + 1];
						// var vx0vy1 = randomData[countX][countY ];
						var vx1vy1 = randomData[countX + 1][countY + 1];

						var interXy0 = vx0vy0 * (1 - f_X) + vx1vy0 * f_X;
						var interXy1 = vx0vy1 * (1 - f_X) + vx1vy1 * f_X;

						perlinRowData[x + smX][y + smY] = Math.round(interXy0 * (1 - f_Y) + interXy1 * f_Y);
						perlinImgData[x + smX][y + smY] += perlinRowData[x + smX][y + smY] * amptitude;
					}

				}

			}

			//--------------------------------------------
			countY++;

		}

		countX++;

	}

	// drawing phase
	var imgData = visCtx.createImageData(wd, hg);

	var countX = 0;
	var countY = 0;

	for (var x = 0; x < wd; x++) {

		for (var y = 0; y < hg; y++) {
			imgData.data[(y * wd + x) * 4] = Math.round(perlinRowData[x][y]);
			imgData.data[(y * wd + x) * 4 + 1] = Math.round(perlinRowData[x][y]);
			imgData.data[(y * wd + x) * 4 + 2] = Math.round(perlinRowData[x][y]);
			imgData.data[(y * wd + x) * 4 + 3] = 255;
		}
	}

	visCtx.putImageData(imgData, 0, 0);

}
