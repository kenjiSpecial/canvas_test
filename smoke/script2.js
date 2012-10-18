
var dataArray = [];

var posX, posY;
var count = 0;

var viewCanvas = document.createElement("canvas");
var nextCanvas = document.createElement("canvas");

var curContext = viewCanvas.getContext("2d");
var nextContext = nextCanvas.getContext("2d");

var cloudObj;

var curImgData, nextImgData;

// ------------------------------------------------

var pts = [
	{x: 37, y: 116},
	{x: 70, y: 76},
	{x: 117, y: 36},
	{x: 160, y: 9},
	{x: 196, y: 36},
	{x: 252, y: 72},
	{x: 320, y: 109},
	{x: 361, y: 59},
	{x: 414, y: 35},
	{x: 459, y: 7},
	{x: 507, y: 64},
	{x: 563, y:114},
	{x: 610, y: 93},
	{x: 633, y: 43},
	{x: 718, y: 59},
	{x: 678, y: 24},
	{x: 727, y: 49},
	{x: 764, y: 74},
	{x: 807, y: 103}
];

var rad = 90;

var tm, tmA;

var baseWd = 960;
	var baseHg = 210;

$(function() {

	var posX = 100; 
	var posY = 200;
	var scale = 1.25;


	viewCanvas.width = nextCanvas.width = baseWd;
	viewCanvas.height = nextCanvas.height = baseHg;
	
	
	
	var testData = curContext.createImageData(baseWd, baseHg);
	
	document.body.appendChild(viewCanvas);
	
	 for(var i = 0; i < pts.length; i++){
	 	var shiki = 90;
	 	var cloudObj = new cloud(viewCanvas, pts[i].x, pts[i].y, rad, shiki);
	 	var shikii = 90;
	 	var nextcloudObj = new cloud(nextCanvas, pts[i].x, pts[i].y, rad, shikii);
	 }
	 
	 
	 
	 var curImageData = curContext.getImageData(0, 0, baseWd, baseHg);
	 var nextImageData = nextContext.getImageData(0, 0, baseWd, baseHg);
	 
	 for(var x = 0; x < baseWd; x++){
	 	for(var y = 0; y < baseHg; y++){
	 		if(curImageData.data[(baseWd * y + x) * 4] != nextImageData.data[(baseWd * y + x) * 4]){
	 			dataArray[(baseWd * y + x)] = (nextImageData.data[(baseWd * y + x) * 4] - curImageData.data[(baseWd * y + x) * 4])/ totalCount;
	 			// console.log(dataArray[(baseWd * y + x)]);
	 		}else{
	 			dataArray[(baseWd * y + x)] = 0;
	 		}
	 	}
	 }
	 
	 // for(var i = 0; i < dataArray.length; i++){
	 	// console.log(dataArray[i]);
	 // }
	 
	 
	 curImgData = curImageData.data;
	 
	
	// -------------------------------
	
	
	//tmA = setInterval("animationLoop()", 33);
	tm = setInterval("loop()", 30);

});

// -------------------------------

var count = 1;
var diCount = 1;
var totalCount = 100;

// -------------------------------



function loop(){
	
	
	
	if(count <= 0 || count >= totalCount)
		diCount *= -1;
	count += diCount;
	
	//--------------------------------------
	
	curContext.clearRect(0, 0, baseWd, baseHg);
	var testData = curContext.createImageData(baseWd, baseHg);
	
	
	for(var x = 0; x < baseWd; x++){
		for(var y = 0; y < baseHg; y++){
			
			if(dataArray[(baseWd * y + x)] != 0){
				var val = dataArray[(baseWd * y + x)] * count + curImgData[(x + y * baseWd) * 4];
				testData.data[(x + y * baseWd) * 4]  = val;
				testData.data[(x + y * baseWd) * 4 + 1]  = 0;
				testData.data[(x + y * baseWd) * 4 + 2]  = 0;
				testData.data[(x + y * baseWd) * 4 + 3]  = val;
				
			}
			
		}
	}
	
	curContext.putImageData(testData, 0, 0);
	
	//--------------------------------------
	
	
}

