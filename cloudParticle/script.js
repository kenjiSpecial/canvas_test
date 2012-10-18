var baseWd = window.innerWidth;
var baseHg = window.innerHeight;

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

var particles = [];
var MAX_PARTICLE = 600;
var particleImage = new Image();
particleImage.src = "cloudImg01.png";

var firstLoopVar;
var stats = new Stats();

$(function () {
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

var loop_count = 0;

function loop() {
    stats.begin();

    if(loop_count % 4 == 0){
        makeParticle(1);
    }

    context.clearRect(0, 0, baseWd, baseHg);
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

    loop_count++;

    stats.end();

}

function firstLoop() {

    makeParticle(1);
    if (particles.length > MAX_PARTICLE)
        clearInterval(firstLoopVar);
}

var count = 0;

function makeParticle(particleCount) {
    count++;

    for (var i = 0; i < particleCount; i++) {
        var particle;


        particle = new ImageParticle(particleImage, baseWd + 200, baseHg * (.8 + .05 * Math.cos(count / MAX_PARTICLE * Math.PI * 2)));
        particle.velX = randomRange(-0.6, -1);


        particle.velY = randomRange(-2, 0)
        particle.size = randomRange(.3, .7);
        particle.maxSize = 1.5;
        particle.alpha = randomRange(.5, .8);
        particle.gravity = .02;
        particle.drag = 1;
        //particle.shrink = .995;
        particle.rotation = randomRange(0, 360);
        particle.spin = randomRange(-0.2, 0.2);
        //particle.shrink = 1.04;
        particle.fade = .0003;

        particles.push(particle);

    }
}
