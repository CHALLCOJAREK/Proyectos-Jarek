/* ============================================================
   NEO•TECH JS PREMIUM
   Animaciones + Canvas + Parallax + Scroll Reveal + QR Engine
============================================================ */

/* ============================================================
   INTRO ANIMADA
============================================================ */
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");

  setTimeout(() => {
    intro.classList.add("hidden");

    setTimeout(() => {
      intro.style.display = "none";
      document.body.classList.add("app-ready");
    }, 800);
  }, 900);
});

/* ============================================================
   HEADER INTELIGENTE
============================================================ */
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header?.classList.add("header-scrolled");
  } else {
    header?.classList.remove("header-scrolled");
  }
});

/* ============================================================
   PARALLAX SUAVE EN HOLOGRAMA
============================================================ */
const holo = document.querySelector(".hero-holo-frame");

window.addEventListener("mousemove", (e) => {
  if (!holo) return;

  const x = (window.innerWidth / 2 - e.clientX) / 40;
  const y = (window.innerHeight / 2 - e.clientY) / 40;

  holo.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${-x}deg)`;
});

/* ============================================================
   SCROLL REVEAL PRO
============================================================ */
const revealElements = document.querySelectorAll(
  ".section, .glass-card, .hero-title, .hero-subtitle"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

/* ============================================================
   HOVER REACTIVO → brillo inteligente
============================================================ */
function addReactiveHover(selector) {
  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    });
  });
}
addReactiveHover(".glass-card");

/* ============================================================
   CANVAS TECH ANIMATED BACKGROUND
============================================================ */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
const NUM_PARTICLES = 65;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createParticles() {
  particles = [];
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    });
  }
}
createParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.fillStyle = "rgba(14,165,233,0.65)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 140) {
        ctx.strokeStyle = `rgba(14,165,233,${1 - dist / 140})`;
        ctx.lineWidth = 0.6;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================================================
   QR GENERATOR ENGINE
============================================================ */

let qrInstance = null;

const textoInput = document.getElementById("texto");
const colorFrenteInput = document.getElementById("colorFrente");
const sizeInput = document.getElementById("size");
const sizeValue = document.getElementById("sizeValue");
const nivelSelect = document.getElementById("nivel");
const downloadBtn = document.getElementById("download");
const btnGenerar = document.getElementById("btnGenerar");

sizeInput.addEventListener("input", () => {
  sizeValue.textContent = sizeInput.value;
});

btnGenerar.addEventListener("click", generarQR);

textoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    generarQR();
  }
});

function nivelToCorrectLevel(n) {
  return QRCode.CorrectLevel[n] || QRCode.CorrectLevel.H;
}

function generarQR() {
  const contenedor = document.getElementById("qrcode");
  contenedor.innerHTML = "";

  const texto = textoInput.value.trim();
  if (!texto) {
    alert("Escribe el contenido que tendrá el código QR.");
    return;
  }

  const size = parseInt(sizeInput.value, 10) || 260;
  const colorFrente = colorFrenteInput.value;
  const nivel = nivelSelect.value;

  qrInstance = new QRCode(contenedor, {
    text: texto,
    width: size,
    height: size,
    colorDark: colorFrente,
    colorLight: "transparent",
    correctLevel: nivelToCorrectLevel(nivel)
  });

  downloadBtn.style.display = "inline-flex";
  downloadBtn.classList.remove("success");
}

downloadBtn.addEventListener("click", descargarQR);

function descargarQR() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) return;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  const ctx2 = tempCanvas.getContext("2d");
  ctx2.drawImage(canvas, 0, 0);

  const enlace = document.createElement("a");
  enlace.download = "codigo-qr.png";
  enlace.href = tempCanvas.toDataURL("image/png");
  enlace.click();

  downloadBtn.classList.add("success");
}
