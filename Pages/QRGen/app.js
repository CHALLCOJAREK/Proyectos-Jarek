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
    header.classList.add("header-scrolled");
  } else {
    header.classList.remove("header-scrolled");
  }
});

/* ============================================================
   PARALLAX SUAVE EN HOLOGRAMA
============================================================ */
const holo = document.querySelector(".hero-holo-frame");

window.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth / 2 - e.clientX) / 40;
  const y = (window.innerHeight / 2 - e.clientY) / 40;
  holo.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${-x}deg)`;
});

/* ============================================================
   SCROLL REVEAL PRO (IntersectionObserver)
============================================================ */
const revealElements = document.querySelectorAll(".section, .glass-card, .hero-title, .hero-subtitle");

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
   HOVER REACTIVO CON BRILLO INTELIGENTE
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
      vy: (Math.random() - 0.5) * 0.4,
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

    // Líneas de conexión
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

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
   QR GENERATOR ENGINE (Tu lógica original optimizada)
============================================================ */

let qrInstance = null;

const textoInput = document.getElementById("texto");
const colorFrenteInput = document.getElementById("colorFrente");
const colorFondoInput = document.getElementById("colorFondo");
const sizeInput = document.getElementById("size");
const sizeValue = document.getElementById("sizeValue");
const nivelSelect = document.getElementById("nivel");
const downloadBtn = document.getElementById("download");
const btnGenerar = document.getElementById("btnGenerar");

sizeInput.addEventListener("input", () => {
  sizeValue.textContent = sizeInput.value;
});

colorFondoInput.addEventListener("input", () => {
  document.documentElement.style.setProperty("--qr-bg", colorFondoInput.value);
});

document.documentElement.style.setProperty("--qr-bg", colorFondoInput.value);

btnGenerar.addEventListener("click", generarQR);

textoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    generarQR();
  }
});

function nivelToCorrectLevel(nivel) {
  switch (nivel) {
    case "L": return QRCode.CorrectLevel.L;
    case "M": return QRCode.CorrectLevel.M;
    case "Q": return QRCode.CorrectLevel.Q;
    case "H":
    default: return QRCode.CorrectLevel.H;
  }
}

function generarQR() {
  const contenedor = document.getElementById("qrcode");
  contenedor.innerHTML = "";

  const texto = textoInput.value.trim();
  const colorFrente = colorFrenteInput.value;
  const visualBackground = colorFondoInput.value;
  const size = parseInt(sizeInput.value, 10) || 260;
  const nivel = nivelSelect.value;

  if (!texto) {
    alert("Escribe el contenido que tendrá el código QR.");
    return;
  }

  document.documentElement.style.setProperty("--qr-bg", visualBackground);

  qrInstance = new QRCode(contenedor, {
    text: texto,
    width: size,
    height: size,
    colorDark: colorFrente,
    colorLight: "transparent",
    correctLevel: nivelToCorrectLevel(nivel),
  });

  downloadBtn.style.display = "inline-flex";
  downloadBtn.classList.remove("success");
  downloadBtn.innerHTML =
    '<i class="fa-solid fa-download"></i> Descargar PNG';
}

downloadBtn.addEventListener("click", descargarQR);

function descargarQR() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) return;

  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;

  const exportCtx = exportCanvas.getContext("2d");
  exportCtx.drawImage(canvas, 0, 0);

  const imgData = exportCtx.getImageData(0, 0, exportCanvas.width, exportCanvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r === 255 && g === 0 && b === 255) {
      data[i + 3] = 0;
    }
  }

  exportCtx.putImageData(imgData, 0, 0);

  const enlace = document.createElement("a");
  enlace.download = "codigo-qr.png";
  enlace.href = exportCanvas.toDataURL("image/png");
  enlace.click();

  downloadBtn.classList.add("success");
  downloadBtn.innerHTML = '<i class="fa-solid fa-check"></i> PNG descargado';
}
