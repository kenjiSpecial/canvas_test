function perlinNoise(canvas) {

	var cnx = canvas.getContext("2d");

	var wd = canvas.width;
	var hg = canvas.height;

	// ------------------------------------------------------

	var perlinImgData = [];
	for (var i = 0; i < wd; i++) {
		perlinImgData[i] = new Array(hg);
		for (var j = 0; j < hg; j++) {
			perlinImgData[i][j] = 0;
		}
	}

	var shindo = 128;
	var aveVal = 128;

	// ------------------------------------------------------

	var Persistence = .9;
	var PersistenceSum = 0;

	var amptitude;

	var freq = 2;
	var weave_num = 0;

	var filterNum = 6;

	for (var i = 0; i < filterNum; i++) {
		calcuration(i)
	}

	var visData = cnx.createImageData(wd, hg);
	for (var x = 0; x < wd; x++) {
		for (var y = 0; y < hg; y++) {
			var val = Math.round(perlinImgData[x][y] / PersistenceSum);
			visData.data[(x + wd * y) * 4] = val;
			visData.data[(x + wd * y) * 4 + 1] = val;
			visData.data[(x + wd * y) * 4 + 2] = val;
			visData.data[(x + wd * y) * 4 + 3] = val;
		}
	}
	cnx.putImageData(visData, 0, 0);

	function calcuration(num) {
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
						if ((x + smX) < wd && (y + smY) < hg) {
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
	}

}