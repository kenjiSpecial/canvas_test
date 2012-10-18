function FluidField(canvas) {

	var iterations = 10;
	var visc = 0.5;
	var dt = 0.06;
	var dens;
	var dens_prev;
	var u;
	var u_prev;
	var v;
	var v_prev;

	var width;
	var height;

	var rowSize;
	var colSize;

	var size;
	var displayFunc;
	var count = 0;

	//-----------------------------------------------
	//---------------     update    -----------------
	//-----------------------------------------------

	this.update = function() {
		queryUI(dens_prev, u_prev, v_prev);
		vel_step(u, v, u_prev, v_prev, dt);
		dens_step(dens, dens_prev, u, v, dt);
		displayFunc(new Field(dens, u, v));
	}
	//-----------------------------------------------
	//--------------- queryUI ----------------------
	//-----------------------------------------------

	function queryUI(d, u, v) {
		// for (var i = 0; i < size; i++)
		// u[i] = v[i] = d[i] = 0.0;
		for (var xPos = 0; xPos < rowSize; xPos++) {
			for (var yPos = 0; yPos < colSize; yPos++) {
				u[xPos][yPos] = v[xPos][yPos] = 0;
				
				
				if (count < 1) {
					if (yPos > 20) {
						var val = (yPos - 20)/(colSize - 20);
						d[xPos][yPos] = 120 * val;
					}else{
						d[xPos][yPos] = 0;
					}
				}else{
					d[xPos][yPos] = 0;
				}

			}
		}

		// alert(colSize)
		// uiCallback(new Field(d, u, v));
		setTheValue(d, u, v);
		
		count++;
	}

	//-----------------------------------------------
	
	var count = 0;
	var totalCount = 100;

	function setTheValue(d, u, v) {
		// d[90][29] = 300;
		// d[90][31] = 50;
		
		yPos1 = parseInt(40 + 12 * Math.cos(count/1000 * Math.PI));
		yPos2 = parseInt(40 + 12 * Math.cos(count/1000 * Math.PI)); 
		
		v[90][yPos + 1] = 5;
		v[90][yPos - 1] = -5;
		
		v[30][yPos + 1] = 5;
		v[30][yPos - 1] = -5;
		
		
		// v[90][40] = .1; 
		// u[90][40] = 4 - Math.random() *8;
		count++;
	}

	//-----------------------------------------------
	//--------------- vel_step ----------------------
	//-----------------------------------------------

	function vel_step(u, v, u0, v0, dt) {
		addFields(u, u0, dt);
		addFields(v, v0, dt);

		//--------------------------

		var temp = u0;
		u0 = u;
		u = temp;

		var temp = v0;
		v0 = v;
		v = temp;

		//--------------------------

		diffuse2(u, u0, v, v0, dt);
		project(u, v, u0, v0);

		//--------------------------

		var temp = u0;
		u0 = u;
		u = temp;

		var temp = v0;
		v0 = v;
		v = temp;

		//--------------------------

		advect(0, u, u0, u0, v0, dt);
		advect(2, v, v0, u0, v0, dt);

		//--------------------------

		project(u, v, u0, v0);
	}

	//-----------------------------------------------
	//--------------- dens_step ---------------------
	//-----------------------------------------------

	function dens_step(x, x0, u, v, dt) {
		addFields(x, x0, dt);
		diffuse(0, x0, x, dt);
		advect(0, x, x0, u, v, dt);
	}

	//-----------------------------------------------
	//----------------- addFields -------------------
	//-----------------------------------------------

	function addFields(x, s, dt) {

		for (var xPos = 0; xPos < rowSize; xPos++) {
			for (var yPos = 0; yPos < colSize; yPos++) {
				x[xPos][yPos] += dt * s[xPos][yPos];
			}
		}

	}

	//-----------------------------------------------
	//----------------- diffuse ---------------------
	//-----------------------------------------------

	function diffuse(b, x, x0, dt) {
		var a = 0;
		lin_solve(b, x, x0, a, 1 + 4 * a);
	}

	//-----------------------------------------------

	function diffuse2(x, x0, y, y0, dt) {
		var a = 0;
		lin_solve2(x, x0, y, y0, a, 1 + 4 * a);
	}

	//-----------------------------------------------
	//---------------- lin_solve --------------------
	//-----------------------------------------------

	function lin_solve(b, x, x0, a, c) {
		if (a === 0 && c === 1) {
			for (var j = 1; j <= height; j++) {
				// var currentRow = j * rowSize;
				// ++currentRow;
				for (var i = 1; i <= width; i++) {
					x[i][j] = x0[i][j];
					// x[currentRow] = x0[currentRow];
					// ++currentRow;
				}
			}
			set_bnd(b, x);
		} else {
			var invC = 1 / c;
			for (var k = 0; k < iterations; k++) {
				for (var j = 1; j <= height; j++) {
					// var lastRow = (j - 1) * rowSize;
					// var currentRow = j * rowSize;
					// var nextRow = (j + 1) * rowSize;
					// var lastX = x[currentRow];
					// ++currentRow;
					for (var i = 1; i <= width; i++)
						x[i][j] = (x0[i][j] + a * (x[i - 1][j] + x[i + 1][j] + x[i][j + 1] + x[i][j - 1] ) ) * invC;
					// lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[++currentRow] + x[++lastRow] + x[++nextRow])) * invC;
				}

				set_bnd(b, x);
			}
		}
	}

	//-----------------------------------------------

	function lin_solve2(x, x0, y, y0, a, c) {
		if (a === 0 && c === 1) {
			for (var j = 1; j <= height; j++) {
				// var currentRow = j * rowSize;
				// ++currentRow;
				for (var i = 1; i <= width; i++) {

					x[i][j] = x0[i][j];
					y[i][j] = y0[i][j];

					// x[currentRow] = x0[currentRow];
					// y[currentRow] = y0[currentRow];
					// ++currentRow;
				}
			}
			set_bnd(0, x);
			set_bnd(2, y);
		} else {
			var invC = 1 / c;
			for (var k = 0; k < iterations; k++) {
				for (var j = 1; j <= height; j++) {
					// var lastRow = (j - 1) * rowSize;
					// var currentRow = j * rowSize;
					// var nextRow = (j + 1) * rowSize;
					// var lastX = x[currentRow];
					// var lastY = y[currentRow];
					// ++currentRow;
					for (var i = 1; i <= width; i++) {
						// lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[currentRow] + x[lastRow] + x[nextRow])) * invC;
						// lastY = y[currentRow] = (y0[currentRow] + a * (lastY + y[++currentRow] + y[++lastRow] + y[++nextRow])) * invC;
						x[i][j] = (x0[i][j] + a * (x[i-1][j] + x[i+1][j] + x[i][j + 1] + x[i][j - 1])) * invC;
						y[i][j] = (y0[i][j] + a * (y[i-1][j] + y[i+1][j] + y[i][j + 1] + y[i][j - 1])) * invC;

					}
				}
				set_bnd(0, x);
				set_bnd(2, y);
			}
		}
	}

	//-----------------------------------------------
	//----------------- advect ----------------------
	//-----------------------------------------------

	function advect(b, d, d0, u, v, dt) {
		var Wdt0 = dt * width;
		var Hdt0 = dt * height;
		var Wp5 = width + 0.5;
		var Hp5 = height + 0.5;
		for (var j = 1; j <= height; j++) {
			// var pos = j * rowSize;
			for (var i = 1; i <= width; i++) {
				// var x = i - Wdt0 * u[++pos];
				// var y = j - Hdt0 * v[pos];

				var x = i - Wdt0 * u[i][j];
				var y = j - Hdt0 * v[i][j];

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

				// var row1 = j0 * rowSize;
				// var row2 = j1 * rowSize;
				// d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);
				d[i][j] = s0 * (t0 * d0[i0][j0] + t1 * d0[i0][j1]) + s1 * (t0 * d0[i1][j0] + t1 * d0[i1][j1]);

			}
		}
		set_bnd(b, d);
	}

	//-----------------------------------------------
	//----------------- project ---------------------
	//-----------------------------------------------

	function project(u, v, p, div) {
		var h = -0.5 / Math.sqrt(width * height);
		for (var j = 1; j <= height; j++) {
			// var row = j * rowSize;
			// var previousRow = (j - 1) * rowSize;
			// var prevValue = row - 1;
			// var currentRow = row;
			// var nextValue = row + 1;
			// var nextRow = (j + 1) * rowSize;
			for (var i = 1; i <= width; i++) {
				// div[++currentRow] = h * (u[++nextValue] - u[++prevValue] + v[++nextRow] - v[++previousRow]);
				// p[currentRow] = 0;
				div[i][j] = h * (u[i + 1][j] - u[i - 1][j] + v[i][j + 1] - v[i][j - 1]);
				p[i][j] = 0;

			}
		}
		set_bnd(0, div);
		set_bnd(0, p);

		lin_solve(0, p, div, 1, 4);

		var wScale = 0.5 * width;
		var hScale = 0.5 * height;
		for (var j = 1; j <= height; j++) {
			// var prevPos = j * rowSize - 1;
			// var currentPos = j * rowSize;
			// var nextPos = j * rowSize + 1;
			// var prevRow = (j - 1) * rowSize;
			// var currentRow = j * rowSize;
			// var nextRow = (j + 1) * rowSize;

			for (var i = 1; i <= width; i++) {
				// u[++currentPos] -= wScale * (p[++nextPos] - p[++prevPos]);
				// v[currentPos] -= hScale * (p[++nextRow] - p[++prevRow]);
				u[i][j] -= wScale * (p[i + 1][j] - p[i - 1][j]);
				v[i][j] -= hScale * (p[i][j + 1] - p[i][j - 1]);
			}
		}

		set_bnd(1, u);
		set_bnd(2, v);
	}

	//-----------------------------------------------
	//----------------- set_bnd ---------------------
	//-----------------------------------------------

	function set_bnd(b, x) {
		if (b === 1) {
			for (var i = 1; i <= width; i++) {
				x[i][0] = x[i][1];
				x[i][height + 1] = x[i][height];
			}

			for (var j = 1; i <= height; i++) {
				// x[j * rowSize] = -x[1 + j * rowSize];
				// x[(width + 1) + j * rowSize] = -x[width + j * rowSize];
				x[0][j] = -1 * x[1][j];
				x[width + 1][j] = -1 * x[width][j];
			}
		} else if (b === 2) {
			for (var i = 1; i <= width; i++) {
				// x[i] = -x[i + rowSize];
				// x[i + (height + 1) * rowSize] = -x[i + height * rowSize];
				x[i][0] = -1 * x[i][1];
				x[i][height + 1] = -1 * x[i][height];
			}

			for (var j = 1; j <= height; j++) {
				// x[j * rowSize] = x[1 + j * rowSize];
				// x[(width + 1) + j * rowSize] = x[width + j * rowSize];
				x[0][j] = x[1][j];
				x[width + 1][j] = x[width][j];
			}
		} else {
			for (var i = 1; i <= width; i++) {
				// x[i] = x[i + rowSize];
				// x[i + (height + 1) * rowSize] = x[i + height * rowSize];

				x[i][0] = x[i][1];
				x[i][height + 1] = x[i][height];

			}

			for (var j = 1; j <= height; j++) {
				// x[j * rowSize] = x[1 + j * rowSize];
				// x[(width + 1) + j * rowSize] = x[width + j * rowSize];

				x[0][j] = x[1][j];
				x[width + 1][j] = x[width][j];
			}
		}
		x[0][0] = 0.5 * (x[1][0] + x[0][1]);
		x[0][height + 1] = 0.5 * (x[1][height + 1] + x[0][height]);
		x[width + 1][0] = 0.5 * (x[width][0] + x[(width + 1)][1]);
		// x[(width + 1) + maxEdge] = 0.5 * (x[width + maxEdge] + x[(width + 1) + height * rowSize]);
		x[width + 1][height + 1] = 0.5 * (x[width][height + 1] + x[(width + 1)][height]);
	}

	//-----------------------------------------------
	//----------- setDisplayFunction ----------------
	//-----------------------------------------------

	this.setDisplayFunction = function(func) {
		displayFunc = func;
	}
	//-----------------------------------------------
	//----------------- the_other -------------------
	//-----------------------------------------------

	this.iterations = function() {
		return iterations;
	}

	this.setIterations = function(iters) {
		if (iters > 0 && iters <= 100)
			iterations = iters;
	}
	// this.setUICallback = function(callback) {
	// uiCallback = callback;
	// }

	this.reset = reset;
	this.setResolution = function(wRes, hRes) {
		var res = wRes * hRes;
		if (res > 0 && res < 1000000 && (wRes != width || hRes != height)) {
			width = wRes;
			height = hRes;
			reset();
			return true;
		}
		return false;
	}
	this.setResolution(64, 64);

	var uiCallback = function(d, u, v) {
	};

	function Field(dens, u, v) {
		// Just exposing the fields here rather than using accessors is a measurable win during display (maybe 5%)
		// but makes the code ugly.
		this.setDensity = function(x, y, d) {
			// dens[(x + 1) + (y + 1) * rowSize] = d;
			dens[x + 1][y + 1] = d;
		}
		this.getDensity = function(x, y) {
			// return dens[(x + 1) + (y + 1) * rowSize];
			return dens[x + 1][y + 1];
		}
		this.setVelocity = function(x, y, xv, yv) {
			// u[(x + 1) + (y + 1) * rowSize] = xv;
			// v[(x + 1) + (y + 1) * rowSize] = yv;
			u[x + 1][y + 1] = xv;
			v[x + 1][y + 1] = yv;
		}
		this.getXVelocity = function(x, y) {
			// return u[(x + 1) + (y + 1) * rowSize];
			return u[x + 1][y + 1];
		}
		this.getYVelocity = function(x, y) {
			// return v[(x + 1) + (y + 1) * rowSize];
			return v[x + 1][y + 1];
		}
		this.width = function() {
			return width;
		}
		this.height = function() {
			return height;
		}
	}

	function reset() {
		rowSize = width + 2;
		colSize = height + 2;

		size = (width + 2) * (height + 2);

		dens = new Array(rowSize);
		dens_prev = new Array(rowSize);
		u = new Array(rowSize);
		u_prev = new Array(rowSize);
		v = new Array(rowSize);
		v_prev = new Array(rowSize);

		for (var xPos = 0; xPos < rowSize; xPos++) {
			dens[xPos] = new Array(colSize);
			dens_prev[xPos] = new Array(colSize);
			u[xPos] = new Array(colSize);
			u_prev[xPos] = new Array(colSize);
			v[xPos] = new Array(colSize);
			v_prev[xPos] = new Array(colSize);

			for (var yPos = 0; yPos < colSize; yPos++) {
				dens[xPos][yPos] = dens_prev[xPos][yPos] = u[xPos][yPos] = u_prev[xPos][yPos] = v[xPos][yPos] = v_prev[xPos][yPos] = 0;
			}

		}

	}

}

