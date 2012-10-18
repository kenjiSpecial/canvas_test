window.onload = function() {

	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");

	var image = new Image();
	image.src = "img/wood.jpg";

	image.addEventListener('load', imageDrawFunc, false);

	var startPosX = 50;
	var startPosY = 50;

	var endPosX = 100;
	var endPosY = 100;

	function imageDrawFunc() {
		context.drawImage(image, 0, 0);
		var wd = image.width;
		var hg = image.height;
		// alert("wd, hg: "+ wd + ", " + hg);
		var imgData = context.getImageData(0, 0, wd, hg);
		console.log(imgData);
		var data = imgData.data;
		var dataLength = data.length;
		console.log("dataLength: " + dataLength);

		// for(var xpos = startPosX; xpos < endPosX; xpos++){
		// 	for(var ypos = startPosY; ypos < endPosY; ypos++){
		// 		data[ (xpos + wd * ypos) * 4 + 0] = Math.random() * 255 | 0;
		// 		data[ (xpos + wd * ypos) * 4 + 1] = Math.random() * 255 | 0;
		// 		data[ (xpos + wd * ypos) * 4 + 2] = Math.random() * 255 | 0;
		// 	}
		// }
		for (var xpos = 0; xpos < wd; xpos++) {
			for (var ypos = 0; ypos < hg; ypos++) {
				if (xpos < startPosX || xpos > endPosX || ypos < startPosY || ypos > endPosY) {
					data[(xpos + wd * ypos) * 4 + 0] = Math.random() * 255 | 0;
					data[(xpos + wd * ypos) * 4 + 1] = Math.random() * 255 | 0;
					data[(xpos + wd * ypos) * 4 + 2] = Math.random() * 255 | 0;
				}
			}
		}

		imgData.data = data;

		context.putImageData(imgData, 0, 0);

	}

};