// ==============================
// SCENE TRANSITIONS
// ==============================
const scenes = document.querySelectorAll('.scene');
let currentScene = 0;

function showNextScene() {
    scenes[currentScene].classList.remove('active');
    currentScene = (currentScene + 1) % scenes.length;
    scenes[currentScene].classList.add('active');
}

setInterval(showNextScene, 8000);


// ==============================
// AUDIO CONTROLS
// ==============================
const music = document.getElementById("music");

function playMusic() {
    music.play();
}

function pauseMusic() {
    music.pause();
}


// ==============================
// FIREWORKS SETUP
// ==============================
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let particles = [];


// ==============================
// FIREWORK CLASS
// ==============================
class Firework {
    constructor(sx, sy, tx, ty) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        this.distanceToTarget = distance(sx, sy, tx, ty);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;

        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }

        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 5;
        this.acceleration = 1.05;
        this.brightness = random(50, 70);
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.speed *= this.acceleration;

        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;

        this.distanceTraveled = distance(
            this.sx,
            this.sy,
            this.x + vx,
            this.y + vy
        );

        if (this.distanceTraveled >= this.distanceToTarget) {
            createParticles(this.tx, this.ty);
            fireworks.splice(index, 1);
        } else {
            this.x += vx;
            this.y += vy;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(
            this.coordinates[this.coordinates.length - 1][0],
            this.coordinates[this.coordinates.length - 1][1]
        );
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${random(0, 360)}, 100%, ${this.brightness}%)`;
        ctx.stroke();
    }
}


// ==============================
// PARTICLE CLASS
// ==============================
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;

        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }

        this.angle = random(0, Math.PI * 2);
        this.speed = random(1, 10);
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = random(0, 360);
        this.brightness = random(50, 80);
        this.alpha = 1;
        this.decay = random(0.015, 0.03);
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;

        this.alpha -= this.decay;

        if (this.alpha <= 0.1) {
            particles.splice(index, 1);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(
            this.coordinates[this.coordinates.length - 1][0],
            this.coordinates[this.coordinates.length - 1][1]
        );
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.stroke();
    }
}


// ==============================
// HELPER FUNCTIONS
// ==============================
function createParticles(x, y) {
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle(x, y));
    }
}

function distance(aX, aY, bX, bY) {
    const x = bX - aX;
    const y = bY - aY;
    return Math.sqrt(x * x + y * y);
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}


// ==============================
// ANIMATION LOOP
// ==============================
function loop() {
    requestAnimationFrame(loop);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'lighter';

    fireworks.forEach((f, i) => {
        f.draw();
        f.update(i);
    });

    particles.forEach((p, i) => {
        p.draw();
        p.update(i);
    });
}


// ==============================
// EVENTS
// ==============================
canvas.addEventListener('click', (e) => {
    fireworks.push(
        new Firework(
            canvas.width / 2,
            canvas.height,
            e.clientX,
            e.clientY
        )
    );
});

setInterval(() => {
    fireworks.push(
        new Firework(
            canvas.width / 2,
            canvas.height,
            random(0, canvas.width),
            random(0, canvas.height / 2)
        )
    );
}, 800);

loop();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
