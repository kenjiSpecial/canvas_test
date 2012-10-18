var visual0Canvas = document.createElement("canvas");
var visual0Context = visual0Canvas.getContext("2d");

var graph0Canvas = document.createElement("canvas");
var graph0Context = graph0Canvas.getContext("2d");

var wd = 400;
var hg = 400;
var frame = 120;

var curFrame = 0;

var visualContainer = document.createElement('div');
visualContainer.id = 'visualContainer';

var graphContainer = document.createElement('div');
graphContainer.id = "graphContainer";

var freq = Math.pow(2, 3);
console.log(freq);

// ------------------------------------

var perlinRowData = new Array(wd);
for (var i = 0; i < wd; i++) {
	perlinRowData[i] = new Array(hg);
	for (var j = 0; j < hg; j++) {
		perlinRowData[i][j] = new Array(frame);
	}
}

// ------------------------------------

$(function() {
	visual0Canvas.width = wd;
	visual0Canvas.height = hg;

	visualContainer.appendChild(visual0Canvas);

	graph0Canvas.width = wd;
	graph0Canvas.height = hg;
	graphContainer.appendChild(graph0Canvas);

	document.body.appendChild(visualContainer);
	document.body.appendChild(graphContainer);

	drawCanvas(freq, visual0Context, graph0Context);

	animate();

});

function drawCanvas(freq, vCnx, gCnx) {
	var freqVal = 128;
	var midFreqVal = 128;

	var randomData = new Array(freq);

	for (var i = 0; i <= freq; i++) {
		randomData[i] = new Array(freq);
		for (var j = 0; j <= freq; j++) {
			randomData[i][j] = new Array(freq);
			for (var k = 0; k <= freq; k++) {
				randomData[i][j][k] = freqVal * (2 * Math.random() - 1) + midFreqVal;
			}

		}

	}

	var interval = Math.ceil(wd / freq);
	var intervalFrame = Math.ceil(wd / freq);

	var countZ = 0;
	var countX;
	var countY;

	// ---------------------------

	for (var z = 0; z < frame; z += intervalFrame) {
		countX = 0;
		for (var x = 0; x < wd; x += interval) {
			countY = 0;

			for (var y = 0; y < hg; y += interval) {

				//--------------------------------------------
				for (var smZ = 0; smZ < intervalFrame; smZ++) {

					var str = "";
					var rateZ = smZ / intervalFrame;
					var ft_Z = rateZ * Math.PI;
					var f_Z = (1 - Math.cos(ft_Z) ) * .5;

					for (var smX = 0; smX < interval; smX++) {

						var rateX = smX / interval;
						var ft_X = rateX * Math.PI;
						var f_X = (1 - Math.cos(ft_X) ) * .5;

						for (var smY = 0; smY < interval; smY++) {

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

							//-----------------------------------------------------------------

							perlinRowData[x + smX][y + smY][z + smZ] = Math.round(vz0 * (1 - f_Z) + vz1 * f_Z);
							// perlinRowData[x + smX][y + smY] = interXy1;

						}

					}
				}

				//--------------------------------------------
				countY++;

			}

			countX++;

		}
		countZ++;

	}
	console.log("done");

	// drawing phase
	var imgData = visual0Context.createImageData(wd, hg);

	var countX = 0;
	var countY = 0;

	for (var x = 0; x < wd; x++) {

		for (var y = 0; y < hg; y++) {
			imgData.data[(y * wd + x) * 4] = Math.round(perlinRowData[x][y][0]);
			imgData.data[(y * wd + x) * 4 + 1] = Math.round(perlinRowData[x][y][0]);
			imgData.data[(y * wd + x) * 4 + 2] = Math.round(perlinRowData[x][y][0]);
			imgData.data[(y * wd + x) * 4 + 3] = Math.round(perlinRowData[x][y][0]);
		}
	}

	visual0Context.putImageData(imgData, 0, 0);

}

window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 10);
	};
})();

function animate() {
	var int=self.setInterval("draw()",33);
}

var div = 1;

function draw() {
	curFrame += div
	if(curFrame >= frame || curFrame <= 0){
		div *= -1;
	}
	
	// console.log(curFrame);
	
	visual0Context.clearRect(0, 0, wd, hg);
	var imgData = visual0Context.createImageData(wd, hg);

	var countX = 0;
	var countY = 0;

	for (var x = 0; x < wd; x++) {

		for (var y = 0; y < hg; y++) {
			imgData.data[(y * wd + x) * 4] = Math.round(perlinRowData[x][y][curFrame]);
			imgData.data[(y * wd + x) * 4 + 1] = Math.round(perlinRowData[x][y][curFrame]);
			imgData.data[(y * wd + x) * 4 + 2] = Math.round(perlinRowData[x][y][curFrame]);
			imgData.data[(y * wd + x) * 4 + 3] = Math.round(perlinRowData[x][y][curFrame]);
		}
	}

	visual0Context.putImageData(imgData, 0, 0);
}

