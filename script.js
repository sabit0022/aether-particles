// Particle system + gesture UI
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mode = 'colorful'; // 'saturn', 'vsign', 'pinch'
let textMessage = '';
let lastTextTime = 0;

// Resize canvas to window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle class
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = color;
    this.life = 1;
    this.maxLife = Math.random() * 60 + 40;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    if (this.life > this.maxLife) return false;
    return true;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 1 - this.life / this.maxLife;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Spawn particles
function spawnParticles(count, x, y, color = '#fff') {
  for (let i = 0; i < count; i++) {    particles.push(new Particle(x, y, color));
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update & draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].update()) {
      particles.splice(i, 1);
    } else {
      particles[i].draw();
    }
  }

  // Draw text if active
  if (textMessage && Date.now() - lastTextTime < 3000) {
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255,255,255,0.7)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#fff';
    ctx.fillText(textMessage, canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(draw);
}

// Mode handlers
function setMode(m) {
  mode = m;
  document.getElementById('gesture').textContent = `Gesture: ${m.charAt(0).toUpperCase() + m.slice(1)}`;
  
  if (m === 'vsign') {
    textMessage = 'I LOVE YOU';
    lastTextTime = Date.now();
    spawnParticles(200, canvas.width/2, canvas.height/2, '#FFD700');
  } else if (m === 'pinch') {
    textMessage = '❤️';
    lastTextTime = Date.now();
    spawnParticles(150, canvas.width/2, canvas.height/2, '#FF69B4');
  } else if (m === 'saturn') {
    textMessage = 'SATURN RING';
    lastTextTime = Date.now();
    spawnParticles(300, canvas.width/2, canvas.height/2, '#4FC3F7');
  } else if (m === 'colorful') {
    textMessage = '';    spawnParticles(500, canvas.width/2, canvas.height/2, 
      `hsl(${Math.random()*360}, 70%, 60%)`);
  }
}

// Simulate gesture detection (since real handtrack needs camera + HTTPS/local)
// For demo, just auto-cycle every 3s
let cycle = 0;
const modes = ['colorful', 'saturn', 'vsign', 'pinch'];
setInterval(() => {
  setMode(modes[cycle % modes.length]);
  cycle++;
}, 3000);

// Start
draw();
