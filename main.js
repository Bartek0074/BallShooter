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
const playerRadius = 12;
const playerColor = '#FAEDF0';

const missileVelocity = 10;
const missileRadius = 3.5;

const enemyMinVelocity = 1;
const enemyMaxVelocity = 1;
const enemyMinRadius = 10;
const enemyMaxRadius = 20;
const enemiesColors =  [
    '#CF0A0A',
    '#00ABB3',
    '#5C2E7E',
    '#1A4D2E',
    '#FF9F29'
]

// Utility functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomColor(color) {
    return color[Math.floor(Math.random() * color.length)];
}

function getDistanceBetweenCircles(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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

        this.velocityX = (this.distX / (Math.sqrt(Math.pow(this.distY, 2) + Math.pow(this.distX, 2)))) * this.velocity;
        this.velocityY = (this.distY / (Math.sqrt(Math.pow(this.distY, 2) + Math.pow(this.distX, 2)))) * this.velocity;
    }

    draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update = function() {

        this.y += this.velocityY;
        this.x += this.velocityX;
        this.draw();
    }
}

class Enemy {
    constructor(x, y, velocity, radius, color) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;

        this.distX = this.x - player.x;
        this.distY = this.y - player.y;
        
        this.velocityX = -(this.distX / (Math.sqrt(Math.pow(this.distY, 2) + Math.pow(this.distX, 2)))) * this.velocity;
        this.velocityY = -(this.distY / (Math.sqrt(Math.pow(this.distY, 2) + Math.pow(this.distX, 2)))) * this.velocity;
    }

    draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update = function() {
        this.y += this.velocityY;
        this.x += this.velocityX;
        this.draw();
    }
}

// Implementation

let player;
let missiles = [];
let enemies = [];

function init() {
    player = new Player(playerX, playerY, playerRadius, playerColor);
}

function spawnEnemies() {
    setInterval(() => {
        const radius = randomIntFromRange(enemyMinRadius, enemyMaxRadius);
        let enemyX;
        let enemyY;

        if (Math.random() < 0.5) {
            enemyX = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            enemyY = Math.random() * canvas.height;
        }
        else {
            enemyX = Math.random() * canvas.width;
            enemyY = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const velocity = randomIntFromRange(enemyMinVelocity, enemyMaxVelocity);
        const color = getRandomColor(enemiesColors);

        const enemy = new Enemy(enemyX, enemyY, velocity, radius, color);
        enemies.push(enemy);

    }, 1000)
}

// Animation loop
let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    
    ctx.fillStyle = 'rgba(16, 24, 34, 0.45';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();

    missiles.forEach((missile, missileIndex) => {
        missile.update();

        enemies.forEach((enemy, enemyIndex) => {
            if (getDistanceBetweenCircles(missile.x, missile.y, enemy.x, enemy.y) <= missile.radius + enemy.radius) {
                missiles.splice(missileIndex, 1);
                enemies.splice(enemyIndex, 1);
            }
        })
    })

    enemies.forEach(enemy => {
        enemy.update();

        if (getDistanceBetweenCircles(enemy.x, enemy.y, player.x, player.y) <= enemy.radius + player.radius) {
            cancelAnimationFrame(animationId);
        }
    })
}

// Event listeners
canvas.addEventListener('mousemove', e => {
    mouse.x = e.clientX - canvas.offsetLeft
    mouse.y = e.clientY - canvas.offsetTop;
})

canvas.addEventListener('click', () => {
    const missile = new Missile(playerX, playerY, missileVelocity, missileRadius, playerColor)
    missiles.push(missile);
})

init();
spawnEnemies();
animate();