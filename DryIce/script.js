var baseWd = 960;
var baseHg = 210;

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

var particles = [];
var MAX_PARTICLE = 200;
var particleImage = new Image();
particleImage.src = "cloudImg01.png";

var firstLoopVar;
var stats = new Stats();

$(function() {
	// alert("call");
	
	stats.setMode(0);
	// 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.body.appendChild(stats.domElement);

	document.body.appendChild(canvas);
	canvas.width = baseWd;
	canvas.height = baseHg;
	makeParticle(1);
	setInterval(loop, 1000 / 60);
	//firstLoopVar = setInterval(firstLoop, 1000 / 30)
});

function loop() {
	stats.begin();

	makeParticle(1);

	context.clearRect(0, 0, baseWd, baseHg);
	context.fillStyle = "rgba(255, 0, 0, 0)";
	context.fillRect(0, 0, baseWd, baseHg);

	for (var i = 0; i < particles.length; i++) {
		var particle = particles[i];
		particle.render(context);
		particle.update();
		
		

	}

	//console.log(particles.length);

	while (particles.length > MAX_PARTICLE) {
		particles.shift();
	}

	stats.end();

}

function firstLoop() {
	console.log("firstLoop");
	makeParticle(1);
	if (particles.length > MAX_PARTICLE)
		clearInterval(firstLoopVar);
}

var count = 0;

function makeParticle(particleCount) {
	count++;

	for (var i = 0; i < particleCount; i++) {
		var particle = new ImageParticle(particleImage, baseWd* Math.random(),  baseHg * 1.1 );

		particle.velY = randomRange(-2, -1)
		particle.size = randomRange(.7, .8);
		particle.maxSize = 1.5;
		particle.alpha = randomRange(.5, .6);
		particle.gravity = .014;
		particle.drag = 1;
		//particle.shrink = .995;
		particle.rotation = randomRange(0, 360);
		particle.spin = randomRange(-.5, .5);
		//particle.shrink = 1.04;
		particle.fade = .003;

		particles.push(particle);

	}
}
