// Initial setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 700;
canvas.height = 600;

// Importing DOM elements
const scoreValue = document.querySelector('.score__value')

// Variables
const mouse = {
    x: undefined,
    y: undefined
}
let score = 0;

const playerX = canvas.width / 2;
const playerY = canvas.height / 2;
const playerRadius = 12;
const playerColor = '#FAEDF0';

const missileVelocity = 5;
const missileRadius = 3.5;

const enemyMinVelocity = 1;
const enemyMaxVelocity = 2;
const enemyMinRadius = 10;
const enemyMaxRadius = 25;
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

function randomNumberFromRange(min, max) {
    return Math.random() * (max - min) + min;
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

class Particle {
    constructor(x, y, velocity, radius, color) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;

        this.angle = Math.random() * 360;

        this.velocityX = Math.cos(this.angle) * velocity;
        this.velocityY = Math.sin(this.angle) * velocity;

        this.alpha = 1;
        this.friction = 0.95;
        this.radiusDecrementation = 0.99;
    }

    draw = function() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    update = function() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        this.alpha -= 0.01;

        this.velocity = Math.sqrt(Math.pow(this.velocityX, 2) + Math.pow(this.velocityY, 2));

        if (this.velocity > 0.05) {
            this.velocityX *= this.friction;
            this.velocityY *= this.friction;
        }

        if (this.radius > 0) {
            this.radius *= this.radiusDecrementation;
        }

        this.draw();
    }
}

// Implementation

let player;
let missiles = [];
let enemies = [];
let particles = [];

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

        const velocity = randomNumberFromRange(enemyMinVelocity, enemyMaxVelocity);
        const color = getRandomColor(enemiesColors);

        const enemy = new Enemy(enemyX, enemyY, velocity, radius, color);
        enemies.push(enemy);

    }, 1000)
}

// Animation loop
let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    
    ctx.fillStyle = 'rgba(16, 24, 34, 0.425';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();

    particles.forEach((particle, particleIndex) => {
        if (particle.alpha < 0.02) {
            particles.splice(particleIndex, 1);
        }
        else particle.update();
    })

    missiles.forEach((missile, missileIndex) => {
        missile.update();

        // removing off screen missiles
        if (missile.x + missile.radius < 0 ||
            missile.x - missile.radius > canvas.width ||
            missile.y + missile.radius < 0 ||
            missile.y - missile.radius > canvas.height) {
            missiles.splice(missileIndex, 1);
        }

        // collision enemy-missile
        enemies.forEach((enemy, enemyIndex) => {
            if (getDistanceBetweenCircles(missile.x, missile.y, enemy.x, enemy.y) <= missile.radius + enemy.radius) {
                
                // boom efect
                const numberOfParticles = randomIntFromRange(10, 20);
                for (let i = 0; i < numberOfParticles; i++) {
                    const particleVelocity = randomNumberFromRange(0.75, 6) * enemy.velocity;
                    const particleRadius = randomNumberFromRange(0.03, 0.15) * enemy.radius;
                    const particle = new Particle(missile.x, missile.y, particleVelocity, particleRadius, enemy.color);
                    particles.push(particle);
                }
                
                // shrinking or removing enemy from array
                missiles.splice(missileIndex, 1);
                if (enemy.radius > 17) {
                    enemy.radius -= 10;
                    score += 100;
                }
                else {
                    enemies.splice(enemyIndex, 1);
                    score += 250;
                }

                // updating score
                scoreValue.textContent = score;
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