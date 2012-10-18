var canvas;
var context;

var canvasWd = 10;
var canvasHg = 10;

var N = 40;
var wd = N;
var hg = N;
var rowSize = N + 2;
var size = (wd + 2) * (hg + 2);

var dens = new Array();
var dens_prev = new Array();

var velX = new Array();
var velX_prev = new Array();

var velY = new Array();
var velY_prev = new Array();

//onload method

var dt = .1;
var iterations = 10;

window.onload = function() {
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");

	for (var i = 0; i < size; i++) {

		dens[i] = dens_prev[i] = velX[i] = velX_prev[i] = velY[i] = velY_prev[i] = 0;

	}

	canvas.width = wd;
	canvas.height = hg;
	
	updateState();

}

function clickView() {
	// 	calcurating of velocity and density
	// updateState();
}

function updateState() {
	console.log("update");
	queryUI(dens_prev, velX_prev, velY_prev);
	vel_step(velX, velY, velX_prev, velY_prev, dt);
	dens_step(dens, dens_prev, velX, velY, dt);
	// displayFunc(new Field(dens, u, v));
	checkTheValue();
	displayView();
	
	setTimeout(updateState, 10);
}

//--------------------------------------------

function displayView(){
	
	for(var i = 1; i <= wd; i++){
		for(var j = 1; j <= hg; j++){
// 			
			// var r = parseInt(Math.random() * 255);
			var r = parseInt(dens[i + j * rowSize]);
			console.log(r);
			// console.log(r);
			context.fillStyle = "rgb(" + r + ", " + r + ", " + r + ")";
      		context.fillRect ( i - 1, j - 1, 1, 1);
		}
	}
	
	
	
}

//--------------------------------------------

function checkTheValue(){
	for(var i = 0; i < size; i++){
		console.log(dens[i]);
	}
	console.log("------------")
}

//--------------------------------------------

function queryUI(d, u, v) {
	for (var i = 0; i < size; i++)
		u[i] = v[i] = d[i] = 0.0;

	setVelocity(4, 1, 0, .1, u, v);
	setDensity(4, 1, 100, d);

}

//--------------------------------------------

function setVelocity(x, y, xv, yv, u, v) {
	u[(x + 1) + (y + 1) * (N + 2)] = xv;
	v[(x + 1) + (y + 1) * (N + 2)] = yv;
}

function setDensity(x, y, u, v) {
	v[(x + 1) + (y + 1) * (N + 2)] = u;
}

//--------------------------------------------

function vel_step(u, v, u0, v0, dt) {

	addFields(u, u0, dt);
	addFields(v, v0, dt);

	var temp = u0;
	u0 = u;
	u = temp;
	var temp = v0;
	v0 = v;
	v = temp;

	diffuse2(u, u0, v, v0, dt);
	project(u, v, u0, v0);

	var temp = u0;
	u0 = u;
	u = temp;
	var temp = v0;
	v0 = v;
	v = temp;

	advect(1, u, u0, u0, v0, dt);
	advect(2, v, v0, u0, v0, dt);
	project(u, v, u0, v0);
}

function dens_step(x, x0, u, v, dt) {
	addFields(x, x0, dt);
	diffuse(0, x0, x, dt);
	advect(0, x, x0, u, v, dt);
}

//--------------------------------------------

function addFields(x, s, dt) {
	for (var i = 0; i < size; i++)
		x[i] += dt * s[i];
}

function set_bnd(b, x) {
	if (b === 1) {
		for (var i = 1; i <= wd; i++) {
			x[i] = x[i + rowSize];
			x[i + (hg + 1) * rowSize] = x[i + hg * rowSize];
		}

		// console.log("width: " + width);

		for (var j = 1; i <= hg; i++) {
			x[j * rowSize] = -x[1 + j * rowSize];
			x[(wd + 1) + j * rowSize] = -x[wd + j * rowSize];
		}
	} else if (b === 2) {
		for (var i = 1; i <= wd; i++) {
			x[i] = -x[i + rowSize];
			x[i + (hg + 1) * rowSize] = -x[i + hg * rowSize];
		}

		for (var j = 1; j <= hg; j++) {
			x[j * rowSize] = x[1 + j * rowSize];
			x[(wd + 1) + j * rowSize] = x[wd + j * rowSize];
		}
	} else {
		for (var i = 1; i <= wd; i++) {
			x[i] = x[i + rowSize];
			x[i + (hg + 1) * rowSize] = x[i + hg * rowSize];
		}

		for (var j = 1; j <= hg; j++) {
			x[j * rowSize] = x[1 + j * rowSize];
			x[(wd + 1) + j * rowSize] = x[wd + j * rowSize];
		}
	}
	var maxEdge = (hg + 1) * rowSize;
	x[0] = 0.5 * (x[1] + x[rowSize]);
	x[maxEdge] = 0.5 * (x[1 + maxEdge] + x[hg * rowSize]);
	x[(wd + 1)] = 0.5 * (x[wd] + x[(wd + 1) + rowSize]);
	x[(wd + 1) + maxEdge] = 0.5 * (x[wd + maxEdge] + x[(wd + 1) + hg * rowSize]);
}

function lin_solve(b, x, x0, a, c) {
	if (a === 0 && c === 1) {
		for (var j = 1; j <= hg; j++) {
			var currentRow = j * rowSize; ++currentRow;
			for (var i = 0; i < wd; i++) {
				x[currentRow] = x0[currentRow]; ++currentRow;
			}
		}
		set_bnd(b, x);
	} else {
		var invC = 1 / c;
		for (var k = 0; k < iterations; k++) {
			for (var j = 1; j <= hg; j++) {
				var lastRow = (j - 1) * rowSize;
				var currentRow = j * rowSize;
				var nextRow = (j + 1) * rowSize;
				var lastX = x[currentRow]; ++currentRow;
				for (var i = 1; i <= wd; i++)
					lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[++currentRow] + x[++lastRow] + x[++nextRow])) * invC;
			}
			set_bnd(b, x);
		}
	}
}

function diffuse(b, x, x0, dt) {
	var a = 0
	lin_solve(b, x, x0, a, 1 + 4 * a);
}

function lin_solve2(x, x0, y, y0, a, c) {
	if (a === 0 && c === 1) {
		for (var j = 1; j <= hg; j++) {
			var currentRow = j * rowSize; ++currentRow;
			for (var i = 0; i < wd; i++) {
				x[currentRow] = x0[currentRow];
				y[currentRow] = y0[currentRow]; ++currentRow;
			}
		}
		set_bnd(1, x);
		set_bnd(2, y);
	} else {
		var invC = 1 / c;
		for (var k = 0; k < iterations; k++) {
			for (var j = 1; j <= hg; j++) {
				var lastRow = (j - 1) * rowSize;
				var currentRow = j * rowSize;
				var nextRow = (j + 1) * rowSize;
				var lastX = x[currentRow];
				var lastY = y[currentRow]; ++currentRow;
				for (var i = 1; i <= wd; i++) {
					lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[currentRow] + x[lastRow] + x[nextRow])) * invC;
					lastY = y[currentRow] = (y0[currentRow] + a * (lastY + y[currentRow++] + y[lastRow++] + y[nextRow++])) * invC;
				}
			}
			set_bnd(1, x);
			set_bnd(2, y);
		}
	}
}

function diffuse2(x, x0, y, y0, dt) {
	var a = 0.0;
	lin_solve2(x, x0, y, y0, a, 1 + 4 * a);
}

function advect(b, d, d0, u, v, dt) {
	// advect(1, u, u0, u0, v0, dt);
	// 		advect(2, v, v0, u0, v0, dt);

	var Wdt0 = dt * wd;
	var Hdt0 = dt * hg;
	var Wp5 = wd + 0.5;
	var Hp5 = hg + 0.5;
	for (var j = 1; j <= hg; j++) {
		var pos = j * rowSize;
		for (var i = 1; i <= wd; i++) {
			var x = i - Wdt0 * u[++pos];
			var y = j - Hdt0 * v[pos];
			if (x < 0.5)
				x = 0.5;
			else if (x > Wp5)
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
			var row1 = j0 * rowSize;
			var row2 = j1 * rowSize;
			d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);
		}
	}
	set_bnd(b, d);
}

function project(u, v, p, div) {
	// project(u, v, u0, v0);
	var h = -0.5 / Math.sqrt(wd * hg);
	for (var j = 1; j <= hg; j++) {
		var row = j * rowSize;
		var previousRow = (j - 1) * rowSize;
		var prevValue = row - 1;
		var currentRow = row;
		var nextValue = row + 1;
		var nextRow = (j + 1) * rowSize;
		for (var i = 1; i <= wd; i++) {
			div[++currentRow] = h * (u[++nextValue] - u[++prevValue] + v[++nextRow] - v[++previousRow]);
			p[currentRow] = 0;
		}
	}
	set_bnd(0, div);
	set_bnd(0, p);

	lin_solve(0, p, div, 1, 4);

	var wScale = 0.5 * wd;
	var hScale = 0.5 * hg;
	for (var j = 1; j <= hg; j++) {
		var prevPos = j * rowSize - 1;
		var currentPos = j * rowSize;
		var nextPos = j * rowSize + 1;
		var prevRow = (j - 1) * rowSize;
		var currentRow = j * rowSize;
		var nextRow = (j + 1) * rowSize;

		for (var i = 1; i <= wd; i++) {
			u[++currentPos] -= wScale * (p[++nextPos] - p[++prevPos]);
			v[currentPos] -= hScale * (p[++nextRow] - p[++prevRow]);
		}
	}
	set_bnd(1, u);
	set_bnd(2, v);
}

