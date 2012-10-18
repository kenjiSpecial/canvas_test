function cloud(drawCanvas, posValX, posValY, side, val) {
	// console.log(val);
	var canvas = document.createElement("canvas");
	canvas.width = side;
	canvas.height = side;
	
	var cnx = canvas.getContext("2d");

	var viewCanvas = drawCanvas;
	var viewContext = drawCanvas.getContext("2d");

	var wd = canvas.width;
	var hg = canvas.height;
	
	// console.log('wd, hg:' + wd + ", " + hg);

	var midWd = wd / 2;
	var midHg = hg / 2;

	var posCloudX = posValX;
	var posCloudY = posValY;

	var enR = side/2;
	// console.log(enR);

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

	// ------------------------------------------------------

	var cloudCover = val;
	var cloudSharpness = .99;

	// ------------------------------------------------------

	for (var i = 0; i < filterNum; i++) {
		calcuration(i)
	}

	draw();

	// ------------------------------------------------------

	function draw() {
		
		var visData = cnx.createImageData(wd, hg);
		var vis2Data = viewContext.getImageData( posCloudX, posCloudY, wd, hg);
		
		
		
		for (var x = 0; x < wd; x++) {
			for (var y = 0; y < hg; y++) {
				var val = Math.round(cloudExpCurve(perlinImgData[x][y] / PersistenceSum) * exponetialEasing(x, y));
				var prevVal = vis2Data.data[(x + wd * y) * 4];
				
				 // if(val < prevVal){
					// // // console.log("call");
					// // console.log(prevVal);
					// val = prevVal;
				 // }
				 
				 val = Math.max(val, prevVal);
				 if(val > 255){
				 	console.log(val);
				 }
				// val = screenVal(val, prevVal);
				// var val = addVal(val, prevVal);
				
				
				visData.data[(x + wd * y) * 4] = val;
				visData.data[(x + wd * y) * 4 + 1] = val;
				visData.data[(x + wd * y) * 4 + 2] = val;
				visData.data[(x + wd * y) * 4 + 3] = val;
				
				

			}
		}
		viewContext.putImageData(visData, posCloudX, posCloudY);
	}
	

	// ------------------------------------------------------
	
	function screenVal(val1, val2){
		return 255 - ((255 - val1) * (255 - val2)/255);
	}
	
	function addVal(val1, val2){
		return Math.min(255, val1 + val2);
	}
	
	// ------------------------------------------------------


	function calcuration(num) {
		num = parseInt(num);

		freq = Math.pow(2, num);
		amptitude = Math.pow(Persistence, num);
		PersistenceSum += amptitude;
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

	function cloudExpCurve(v) {

		if (cloudCover > 0) {

			var c = v - cloudCover;

			if (c < 0)
				c = 0;

		}

		var cloudDensity = 255 - Math.pow(cloudSharpness, c) * 255;
		// var cloudDensity = 255;

		return cloudDensity
	}

	function exponetialEasing(x, y) {
		var val = Math.sqrt(Math.pow(x - midWd, 2) + Math.pow(y - midHg, 2));
		
		var reVal = 1 - Math.pow(2, 10 * (val / enR - 1));
		
		if (reVal > 0.1) {
			return reVal;
		} else {
			return 0;
		}

	}


	this.update = function(posValX, posValY) {
		posCloudX = posValX;
		posCloudY = posValY;
		
		viewContext.clearRect(0, 0, viewCanvas.width, viewCanvas.height);
		
		draw();

	};

}