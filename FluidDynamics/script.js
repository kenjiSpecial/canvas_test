var canvas;
var context;

var canvasWd = 10;
var canvasHg = 10;

var N = 40;
var wd = N;
var hg = N;
var size = (wd + 2) * (hg + 2);

var dens = new Array();
var dens_prev = new Array();

var vecVel = new Array();
var vecVel_prev = new Array();

//variale
var iterations = 10;

window.onload = function() {
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");

	for (var i = 0; i < size; i++) {
		dens[i] = dens_prev[i] = 0;

		vecVel_prev[i] = vecVel[i] = {
			"x" : 0,
			"y" : 0
		};
	}

	canvas.width = wd;
	canvas.height = hg;

	// console.log(posNum(1, 1));

}
function clickView() {
	// console.log("click");
	update();
	checkTheValue();
}

function update() {
	
	// console.log("update");
	queryUI();
	velStep();
	densStep();
	drawingUI();
	
}

// --------------------------------

function drawingUI(){
	
}


// --------------------------------

function densStep(){
	addDensSource();
	diffuseDens();
	advectDens();
}

// --------------------------------

function velStep() {
	addVelSource();

	//swap
	var temp = vecVel_prev;
	vecVel_prev = vecVel;
	vecVel = vecVel_prev;

	diffuseVelUse();
	
	// console.log("project");
	project();

	var temp = vecVel_prev;
	vecVel_prev = vecVel;
	vecVel = vecVel_prev;
	
	// console.log("advectVel");
	// advectVel();
// 	
	project();
}

//---------------------------------

function advectVel() {
	var tm = 1;
	var Wdt0 = tm * wd;
	var Hdt0 = tm * hg;

	var Wp5 = wd + 0.5;
	var Hp5 = hg + 0.5;

	for (var j = 1; j <= hg; j++) {
		for (var i = 1; i <= wd; i++) {
			var curPos = posNum(i, j);
			var x = i - Wdt0 * vecVel_prev[curPos].x;
			var y = j - Hdt0 * vecVel_prev[curPos].y;

			if (x < 0.5)
				x = .5;
			if (x > Wp5)
				x = Wp5;

			var i0 = x | 0;
			var i1 = i0 + 1;

			if (y < 0.5)
				y = 0.5;
			else if (y > Hp5)
				y = Hp5;
			var j0 = y | 0;
			var j1 = j0 + 1;
			
			var s1 = x - i0;
			var s0 = 1 - s1;
			
			var t1 = y - j0;
			var t0 = 1 - t1;
			
			vecVel[curPos].x = s0 * (t0 * vecVel_prev[posNum(i0, j0)].x + t1 * vecVel_prev[posNum(i0, j1)].x) + s1 * (t0 * vecVel_prev[posNum(i1, j0)].x + t1 * vecVel_prev[posNum(i1, j1)].x);
			vecVel[curPos].y = s0 * (t0 * vecVel_prev[posNum(i0, j0)].y + t1 * vecVel_prev[posNum(i0, j1)].y) + s1 * (t0 * vecVel_prev[posNum(i1, j0)].y + t1 * vecVel_prev[posNum(i1, j1)].y);
			

		}
	}

}

function advectDens(){
	var tm = 1;
	var Wdt0 = tm * wd;
	var Hdt0 = tm * hg;

	var Wp5 = wd + 0.5;
	var Hp5 = hg + 0.5;

	for (var j = 1; j <= hg; j++) {
		for (var i = 1; i <= wd; i++) {
			var curPos = posNum(i, j);
			var x = i - Wdt0 * vecVel_prev[curPos].x;
			var y = j - Hdt0 * vecVel_prev[curPos].y;

			if (x < 0.5)
				x = .5;
			if (x > Wp5)
				x = Wp5;

			var i0 = x | 0;
			var i1 = i0 + 1;

			if (y < 0.5)
				y = 0.5;
			else if (y > Hp5)
				y = Hp5;
			var j0 = y | 0;
			var j1 = j0 + 1;
			
			var s1 = x - i0;
			var s0 = 1 - s1;
			
			var t1 = y - j0;
			var t0 = 1 - t1;
			
			dens[curPos].x = s0 * (t0 * dens_prev[posNum(i0, j0)] + t1 * dens_prev[posNum(i0, j1)]) + s1 * (t0 * dens_prev[posNum(i1, j0)] + t1 * dens_prev[posNum(i1, j1)]);

		}
	}
}



//---------------------------------

function project() {
	var h = -0.5 / Math.sqrt(wd * hg);

	for (var y = 1; y <= hg; y++) {
		for (var x = 1; x <= wd; x++) {
			var curPos = posNum(x, y);
			var lastRowPos = posNum(x, y - 1);
			var nextRowPos = posNum(x, y + 1);
			var lastColPos = posNum(x - 1, y);
			var nextColPos = posNum(x + 1, y);

			vecVel_prev[curPos].y = h * (vecVel[nextColPos].x - vecVel[lastColPos].x + vecVel[nextRowPos].y - vecVel[lastRowPos].y);
			vecVel_prev[curPos].x = 0;

		}
	}

	for (var k = 0; k < iterations; k++) {
		for (var y = 1; y <= hg; y++) {
			for (var x = 1; x <= wd; x++) {
				var curPos = posNum(x, y);
				var lastRowPos = posNum(x, y - 1);
				var nextRowPos = posNum(x, y + 1);
				var lastColPos = posNum(x - 1, y);
				var nextColPos = posNum(x + 1, y);

				vecVel_prev[curPos].x = (vecVel_prev[curPos].y + vecVel_prev[lastRowPos].x + vecVel_prev[nextRowPos].x + vecVel_prev[lastColPos].x + vecVel_prev[nextColPos].x ) / 4;

			}
		}
	}

	var wScale = 0.5 * wd;
	var hScale = 0.5 * hg;

	for (var y = 1; y <= hg; y++) {
		for (var x = 1; x <= wd; x++) {
			var curPos = posNum(x, y);
			var lastRowPos = posNum(x, y - 1);
			var nextRowPos = posNum(x, y + 1);
			var lastColPos = posNum(x - 1, y);
			var nextColPos = posNum(x + 1, y);

			vecVel[curPos].x -= wScale * (vecVel_prev[nextColPos].x - vecVel_prev[lastColPos].x);
			vecVel[curPos].y -= wScale * (vecVel_prev[nextRowPos].x - vecVel_prev[lastRowPos].x);

		}
	}

}

//---------------------------------

function queryUI() {
	// console.log("queryUI Size: " + size)
	for (var i = 0; i < size; i++) {
		dens_prev[i] = 0;
		vecVel_prev[i].x = vecVel_prev[i].y = 0;
	}
	
	settingFrame();
	
}

//---------------------------------

function settingFrame(){
	
	setVelocity(3, 3, 0, 0.01);
	setDensity(3, 3, 10)
}

//---------------------------------

function setVelocity(posX, posY, dx, dy){
	vecVel[posNum(posX, posY)].x = dx;
	vecVel[posNum(posX, posY)].y = dy;
}

function setDensity(posX, posY, densVal){
	dens[posNum(posX, posY)] = densVal;	
}

//---------------------------------

function addVelSource() {

	for (var i = 0; i < size; i++) {
		vecVel[i].x = vecVel_prev[i].x * 1;
		vecVel[i].y = vecVel_prev[i].y * 1;
	}

}

function addDensSource(){
	for(var i = 0; i < size; i++){
		dens[i] = dens_prev[i] * 1;
	}
}

//---------------------------------

function diffuseDens(){
	var a = 0;
	var c = 1 + 4 * a;
	
	if (a === 0) {
		
		for (var j = 1; j <= hg; j++) {
			for (var i = 1; i <= wd; i++) {
				var curPos = posNum(i, j);
				dens[curPos] = dens_prev[curPos];
			}
		}
		
	}else{
		
		for (var k = 0; k < iterations; k++) {
			for (var j = 1; j <= hg; j++) {
				for (var i = 1; i <= wd; i++) {
					var curPos = posNum(i, j);
					var lastRowPos = posNum(i, j - 1);
					var nextRowPos = posNum(i, j + 1);
					var lastColPos = posNum(i - 1, j);
					var nextColPos = posNum(i + 1, j);

					dens[curPos].x = (dens_prev[curPos] + a * (dens_prev[lastRowPos] + dens_prev[nextRowPos] + dens_prev[lastColPos] + dens_prev[nextColPos] )) / (1 + 4 * a);
					
				}
			}
		}
		
	}
	
}


function diffuseVelUse() {
	var a = 0;
	var c = 1 + 4 * a;

	if (a === 0) {

		for (var j = 1; j <= hg; j++) {
			for (var i = 1; i <= wd; i++) {
				var curPos = posNum(i, j);
				vecVel[curPos] = vecVel_prev[curPos];
			}
		}

	} else {

		for (var k = 0; k < iterations; k++) {
			for (var j = 1; j <= hg; j++) {
				for (var i = 1; i <= wd; i++) {
					var curPos = posNum(i, j);
					var lastRowPos = posNum(i, j - 1);
					var nextRowPos = posNum(i, j + 1);
					var lastColPos = posNum(i - 1, j);
					var nextColPos = posNum(i + 1, j);

					vecVel[curPos].x = (vecVel_prev[curPos].x + a * (vecVel[lastRowPos].x + vecVel[nextRowPos].x + vecVel[lastColPos].x + vecVel[nextColPos].x )) / (1 + 4 * a);
					vecVel[curPos].y = (vecVel_prev[curPos].y + a * (vecVel[lastRowPos].y + vecVel[nextRowPos].y + vecVel[lastColPos].y + vecVel[nextColPos].y )) / (1 + 4 * a);
				}
			}
		}

	}

}


//---------------------------------

function checkTheValue(){
	for(var i = 0; i < size; i++){
		console.log(vecVel[i].y);
	}
}


//---------------------------------
// -------- for visual ------------





// ===================================
// ---------- just for test ----------
// -----------------------------------

function drawingTest1() {
	console.log("wd: " + wd + ", hg: " + hg);

	for (var i = 0; i < wd; i++) {
		for (var j = 0; j < hg; j++) {
			console.log(u[i + 1 + (j + 1) * (wd)]);
			context.fillStyle = 'rgb(' + u[i + 1 + (j + 1) * (wd)] + ',' + u[i + 1 + (j + 1) * (wd)] + ',' + u[i + 1 + (j + 1) * (wd)] + ')';
			context.fillRect(i, j, 1, 1);
		}
	}
}

function posNum(x, y) {
	return x + (wd + 2) * y;
}
