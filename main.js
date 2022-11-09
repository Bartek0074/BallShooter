// Initial setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 700;
canvas.height = 600;

// Variables
const mouse = {
    x: undefined,
    y: undefined
}

const playerX = canvas.width / 2;
const playerY = canvas.height / 2;
const playerRadius = 10;
const playerColor = '#FAEDF0';

const missileVelocity = 10;
const missileRadius = 5;
const missilesColors =  [
    '#CF0A0A',
    '#00ABB3',
    '#5C2E7E',
    '#1A4D2E'
]

// Utility functions
// function getRandomIntFromRange

function getRandomColor(color) {
    return color[Math.floor(Math.random() * color.length)];
}

// Classes
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update = function() {

        this.draw();
    }
}

class Missile {
    constructor(x, y, velocity, radius, color) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;

        this.distX = mouse.x - player.x;
        this.distY = mouse.y - player.y;

        this.dx = (this.distX / (Math.sqrt(Math.pow(this.distY, 2) + Math.pow(this.distX, 2)))) * this.velocity;
        this.dy = (this.distY / (Math.sqrt(Math.pow(this.distY, 2) + Math.pow(this.distX, 2)))) * this.velocity;

    }

    draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update = function() {

        this.y += this.dy;
        this.x += this.dx;
        this.draw();
    }
}

// Implementation

let player;
let missiles = [];

function init() {
    player = new Player(playerX, playerY, playerRadius, playerColor)
}



// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    ctx.fillStyle = 'rgba(16, 24, 34, 0.45';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();

    missiles.forEach(missile => {
        missile.update();
    })
    // missile.update();
}

// Event listeners
canvas.addEventListener('mousemove', e => {
    mouse.x = e.clientX - canvas.offsetLeft
    mouse.y = e.clientY - canvas.offsetTop;
    console.log(mouse)
})

canvas.addEventListener('click', () => {
    const missile = new Missile(playerX, playerY, missileVelocity, missileRadius, playerColor)
    missiles.push(missile);
})

init();
animate();