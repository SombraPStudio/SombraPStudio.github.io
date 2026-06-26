const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mx = 0, my = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  setTimeout(() => {
    trail.style.left = mx + 'px';
    trail.style.top = my + 'px';
  }, 80);
});

const overlay = document.getElementById("overlay");
const logo = document.getElementById("logo");
const img_center = document.getElementById("CenterLogo");

let Active = false;

logo.addEventListener("click", () => {
  if (!Active) {
    overlay.classList.add("show");
    img_center.classList.add("show");
    Active = true;
  }
});

img_center.addEventListener("click", () => {
  if (Active) {
    overlay.classList.remove("show");
    img_center.classList.remove("show");
    Active = false;
  }
});

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 1.5 + 0.3;
    this.alpha = Math.random() * 0.4 + 0.05;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59,130,246,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(37,99,235,${0.06 * (1 - dist/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animate);
}
animate();

const roles = ['UI/UX Designer', 'Frontend Developer', 'Creador de experiencias', 'Tu próximo colaborador'];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.querySelector('.typed-text');
function type() {
  const current = roles[ri];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ci++);
    if (ci > current.length) { deleting = true; setTimeout(type, 1800); return; }
    setTimeout(type, 70);
  } else {
    typedEl.textContent = current.slice(0, ci--);
    if (ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; }
    setTimeout(type, 35);
  }
}
setTimeout(type, 1200);

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');

      const fills = e.target.querySelectorAll ? e.target.querySelectorAll('.skill-fill') : [];
      fills.forEach(f => {
        setTimeout(() => { f.style.width = f.dataset.width + '%'; }, 300);
      });

      const counters = e.target.querySelectorAll ? e.target.querySelectorAll('[data-count]') : [];
      counters.forEach(c => {
        const target = parseInt(c.dataset.count);
        let n = 0;
        const step = target / 40;
        const interval = setInterval(() => {
          n = Math.min(n + step, target);
          c.textContent = Math.round(n) + (target === 100 ? '' : '+');
          if (n >= target) clearInterval(interval);
        }, 30);
      });
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

const aboutSection = document.getElementById('about');
const skillObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.skill-fill').forEach((f, i) => {
      setTimeout(() => { f.style.width = f.dataset.width + '%'; }, 400 + i * 120);
    });
    document.querySelectorAll('[data-count]').forEach(c => {
      const target = parseInt(c.dataset.count);
      let n = 0;
      const step = Math.ceil(target / 40);
      const interval = setInterval(() => {
        n = Math.min(n + step, target);
        c.textContent = Math.round(n) + (target < 100 ? '+' : '%');
        if (n >= target) clearInterval(interval);
      }, 30);
    });
  }
}, { threshold: 0.3 });
skillObserver.observe(aboutSection);

const sections = ['hero','about','projects','pricing','contact'];
const dots = document.querySelectorAll('.dot');
const secObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      dots.forEach(d => d.classList.remove('active'));
      const dot = document.querySelector(`[data-section="${id}"]`);
      if (dot) dot.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) secObserver.observe(el);
});
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    document.getElementById(dot.dataset.section).scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          card.style.transition = 'opacity 0.4s, transform 0.4s';
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

function contactPlan(btn) {
  const plan = btn.dataset.plan;
  const msg = encodeURIComponent(`Hola! Me interesa el plan ${plan}. ¿Podemos hablar?`);
  window.open(`https://wa.me/50670494043?text=${msg}`, '_blank');
}

const popup = document.getElementById("InfoPopUp");
const openBtn = document.getElementById("InfoDominio");
const closeBtn = document.getElementById("closeInfo");

openBtn.addEventListener("click", () => {
popup.classList.add("active");

document.body.style.overflow = "hidden";
});

function closePopup() {
popup.classList.remove("active");

document.body.style.overflow = "";
}

closeBtn.addEventListener("click", closePopup);

popup.addEventListener("click", (e) => {
if (e.target === popup) {
closePopup();
}
});

