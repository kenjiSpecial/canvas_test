var visual0Canvas = document.createElement("canvas");
var visual0Context = visual0Canvas.getContext("2d");

var graph0Canvas = document.createElement("canvas");
var graph0Context = graph0Canvas.getContext("2d");

var wd = 400;
var hg = 400;

var visualContainer = document.createElement('div');
visualContainer.id = 'visualContainer';

var graphContainer = document.createElement('div');
graphContainer.id = "graphContainer";

var freq = Math.pow(2, 4);
console.log(freq);

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
});

function drawCanvas(freq, vCnx, gCnx) {
	var freqVal = 128;
	var midFreqVal = 128;

	var randomData = new Array(freq);

	for (var i = 0; i <= freq; i++) {
		randomData[i] = new Array(freq);
		for (var j = 0; j <= freq; j++) {
			randomData[i][j] = freqVal * (2 * Math.random() - 1) + midFreqVal;
		}

	}

	var interval = Math.ceil(wd / freq);
	var perlinRowData = new Array(wd);
	for(var i = 0; i < wd; i++){
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
					// perlinRowData[x + smX][y + smY] = interXy1;
					
					}

			}
			

			//--------------------------------------------
			countY++;

		}

		countX++;

	}
	


	// drawing phase
	var imgData = visual0Context.createImageData(wd, hg);
	
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

	visual0Context.putImageData(imgData, 0, 0);

}
