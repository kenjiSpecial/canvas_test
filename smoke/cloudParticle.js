function cloudParticle(posX, posY) {
	// the position of the particle
	this.posX = posx;
	this.posY = posy;
	// the velocity
	this.velX = 0;
	this.velY = 0;

	// multiply the particle size by this every frame
	this.shrink = 1;
	this.size = 1;
	// if maxSize is a positive value, limit the size of
	// the particle (this is for growing particles).
	this.maxSize = -1;

	// if true then make the particle flicker
	this.shimmer = false;

	// multiply the velocity by this every frame to create
	// drag. A number between 0 and 1, closer to one is
	// more slippery, closer to 0 is more sticky. values
	// below 0.6 are pretty much stuck :)
	this.drag = 1;

	// add this to the yVel every frame to simulate gravity
	// this.gravity = 0;

	// current transparency of the image
	this.alpha = 1;
	// subtracted from the alpha every frame to make it fade out
	this.fade = 0;

	// the amount to rotate every frame
	this.spin = 0;
	// the current rotation
	this.rotation = 0;

	this.update = function() {

		// simulate drag
		this.velX *= this.drag;
		this.velY *= this.drag;

		//add gravity force to the ve

		this.posX += this.velX;

		if (this.posX <= 0) {
			this.posX = 0;
		} else if (this.posX >= canvas.width) {
			this.posX = canvas.width - 1;
		}
		
		//-----------------------------------------------
		
		this.posY += this.velY;
		
		if (this.posY <= 0) {
			this.posY = 0;
		} else if (this.posY >= canvas.height) {
			this.posY = canvas.height - 1;
		}

	}

	this.render = function(cnx) {
		
	}
}
