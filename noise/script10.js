// <!-- noise Test 1, dimensition 1 every pixel-->

var wd = 300;
var hg = 300;

var frame = 90;
var curFrame = 0;
var div = 1;

// ------------------------------------------------------

var visualCanvasArr = [];
var visualContextArr = [];

var perlinImgData = [];
for (var i = 0; i < wd; i++) {
	perlinImgData[i] = new Array(300);
	for (var j = 0; j < hg; j++) {
		perlinImgData[i][j] = new Array(frame);
		for (var k = 0; k < frame; k++) {
			perlinImgData[i][j][k] = 0;
		}
	}
}
// console.log(perlinImgData[0]);

var finalVisualCanvas = document.createElement("canvas");
var finalVisualContext = finalVisualCanvas.getContext("2d");

// ------------------------------------------------------

var visualContainer = document.createElement('div');
visualContainer.id = 'visualContainer';

// ------------------------------------------------------

var shindo = 128;
var aveVal = 128;

// ------------------------------------------------------

var Persistence = .7;
var PersistenceSum = 0;
// frequency = 2 weave_num
var amptitude;
// amplitude = persistence i
var freq = 2;
var totalCount = 4;

$(function() {

	finalVisualCanvas.width = wd;
	finalVisualCanvas.height = hg;

	visualContainer.appendChild(finalVisualCanvas);

	document.body.appendChild(visualContainer);

	// 	--------------------------------------------------------

	for (var i = 0; i < totalCount; i++) {
		calIt(i);
	}

	var visData = finalVisualContext.createImageData(wd, hg);
	for (var x = 0; x < wd; x++) {
		for (var y = 0; y < hg; y++) {

			var val = Math.round(perlinImgData[x][y][0] / PersistenceSum);
			visData.data[(x + wd * y) * 4] = val;
			visData.data[(x + wd * y) * 4 + 1] = val;
			visData.data[(x + wd * y) * 4 + 2] = val;
			visData.data[(x + wd * y) * 4 + 3] = val;
		}
	}
	finalVisualContext.putImageData(visData, 0, 0);

	animate();

});

function animate() {

	 var int = self.setInterval("draw()", 33);

}

function draw() {
	
	curFrame += div
	if (curFrame >= frame - 1 || curFrame <= 0) {
		div *= -1;
	}

	// console.log(curFrame);

	finalVisualContext.clearRect(0, 0, wd, hg);
	var imgData = finalVisualContext.createImageData(wd, hg);

	var countX = 0;
	var countY = 0;

	for (var x = 0; x < wd; x++) {

		for (var y = 0; y < hg; y++) {
			var val = Math.round(perlinImgData[x][y][curFrame] / PersistenceSum);
			imgData.data[(y * wd + x) * 4] = val;
			imgData.data[(y * wd + x) * 4 + 1] = val;
			imgData.data[(y * wd + x) * 4 + 2] = val;
			imgData.data[(y * wd + x) * 4 + 3] = val;
		}
	}

	finalVisualContext.putImageData(imgData, 0, 0);
}

function calIt(num) {
	num = parseInt(num);

	freq = Math.pow(2, num);
	amptitude = Math.pow(Persistence, num);
	PersistenceSum += amptitude;
	// console.log("");
	// console.log("num: " + num + ", freq: " + freq + ", amptitude: " + amptitude);

	// 	--------------------------------------------------------

	var randomData = new Array(freq);
	for (var i = 0; i < freq + 1; i++) {
		randomData[i] = new Array(freq);

		for (var j = 0; j < freq + 1; j++) {
			randomData[i][j] = new Array(freq);

			for (var k = 0; k < freq + 1; k++) {
				randomData[i][j][k] = shindo * amptitude * (2 * Math.random() - 1) + aveVal;
			}

		}

	}

	var interval = Math.ceil(wd / freq);
	var intervalFrame = Math.ceil(wd / freq);

	var countZ = 0;
	var countX;
	var countY;

	for (var z = 0; z < frame; z += intervalFrame) {
		countX = 0;
		for (var x = 0; x < wd; x += interval) {
			// perlinRowData[x] = new Array(hg);
			countY = 0;

			for (var y = 0; y < hg; y += interval) {

				//--------------------------------------------
				for (var smZ = 0; smZ < intervalFrame; smZ++) {

					var rateZ = smZ / intervalFrame;
					var ft_Z = rateZ * Math.PI;
					var f_Z = (1 - Math.cos(ft_Z) ) * .5;

					for (var smX = 0; smX < interval; smX++) {

						var rateX = smX / interval;
						var ft_X = rateX * Math.PI;
						var f_X = (1 - Math.cos(ft_X) ) * .5;

						for (var smY = 0; smY < interval; smY++) {
							if ((x + smX) < wd && (y + smY) < hg && (z + smZ) < frame) {
								var rateY = smY / interval;
								var ft_Y = rateY * Math.PI;
								var f_Y = (1 - Math.cos(ft_Y)) * .5;

								//-----------------------------------------------------------------

								var vx0vy0vz0 = randomData[countX][countY][countZ];
								var vx1vy0vz0 = randomData[countX + 1][countY][countZ];

								var vx0vy1vz0 = randomData[countX][countY + 1][countZ];
								var vx1vy1vz0 = randomData[countX + 1][countY + 1][countZ];

								var vx0vy0vz1 = randomData[countX][countY][countZ + 1];
								var vx1vy0vz1 = randomData[countX + 1][countY][countZ + 1];

								var vx0vy1vz1 = randomData[countX][countY + 1][countZ + 1];
								var vx1vy1vz1 = randomData[countX + 1][countY + 1][countZ + 1];

								//-----------------------------------------------------------------

								var vy0vz0 = vx0vy0vz0 * (1 - f_X) + vx1vy0vz0 * f_X;
								var vy1vz0 = vx0vy1vz0 * (1 - f_X) + vx1vy1vz0 * f_X;

								var vy0vz1 = vx0vy0vz1 * (1 - f_X) + vx1vy0vz1 * f_X;
								var vy1vz1 = vx0vy1vz1 * (1 - f_X) + vx1vy1vz1 * f_X;

								//-----------------------------------------------------------------

								var vz0 = vy0vz0 * (1 - f_Y) + vy1vz0 * f_Y;
								var vz1 = vy0vz1 * (1 - f_Y) + vy1vz1 * f_Y;

								perlinImgData[x + smX][y + smY][z + smZ] += Math.round(vz0 * (1 - f_Z) + vz1 * f_Z) * amptitude;
								// console.log(perlinImgData[x + smX][y + smY][z + smZ]);
							}

						}

					}
					//--------------------------------------------
				}
				countY++;
			}

			countX++;

		}

		countZ++;

	}

}
