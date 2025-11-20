/* ============================================================
   00) INTRO ANIMADO — Fade + Delay Premium
============================================================ */
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");

  setTimeout(() => {
    intro.classList.add("hidden");

    setTimeout(() => {
      intro.style.display = "none";
      document.body.classList.add("app-loaded");
    }, 600);
  }, 900);
});


/* ============================================================
   01) ELEMENTOS
============================================================ */
const phoneInput = document.getElementById("phone");
const messageInput = document.getElementById("message");
const countrySelect = document.getElementById("countryCode");

const btnGenerate = document.getElementById("btnGenerate");
const btnOpen = document.getElementById("btnOpen");
const btnCopy = document.getElementById("btnCopy");

const outputCard = document.getElementById("outputCard");
const outputLinkEl = document.getElementById("outputLink");

let lastLink = "";


/* ============================================================
   02) CANVAS BACKGROUND — Green Grid Premium
============================================================ */
const canvas = document.getElementById("bg-canvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  const TOTAL = 70;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resize();
  window.addEventListener("resize", resize);

  function spawn() {
    particles = [];
    for (let i = 0; i < TOTAL; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      });
    }
  }

  spawn();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo suave dinámico
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "rgba(16,185,129,0.10)");
    grad.addColorStop(1, "rgba(2,6,23,0.65)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Punto
      ctx.fillStyle = "rgba(34,197,94,0.9)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      // Conexiones
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.strokeStyle = `rgba(34,197,94,${(1 - dist / 140) * 0.55})`;
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}


/* ============================================================
   03) FUNCIÓN PARA ARMAR EL LINK
============================================================ */
function buildWhatsAppLink() {
  let basePhone = phoneInput.value.trim();
  const prefix = countrySelect.value.trim();

  // limpiar número
  basePhone = basePhone.replace(/[^\d]/g, "");

  if (!basePhone) {
    alert("Ingresa un número válido.");
    return null;
  }

  const fullPhone = prefix ? prefix + basePhone : basePhone;

  const msg = messageInput.value.trim();
  if (!msg) {
    alert("Escribe un mensaje para generar el enlace.");
    return null;
  }

  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
}


/* ============================================================
   04) BOTONES
============================================================ */
btnGenerate.addEventListener("click", () => {
  const url = buildWhatsAppLink();
  if (!url) return;

  lastLink = url;
  outputLinkEl.textContent = url;
  outputCard.style.display = "flex";

  btnOpen.disabled = false;
  btnCopy.disabled = false;

  btnCopy.classList.remove("success");
  btnCopy.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar enlace';
});

btnOpen.addEventListener("click", () => {
  if (!lastLink) return;
  window.open(lastLink, "_blank");
});

btnCopy.addEventListener("click", async () => {
  if (!lastLink) return;

  try {
    await navigator.clipboard.writeText(lastLink);

    btnCopy.classList.add("success");
    btnCopy.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';

    setTimeout(() => {
      btnCopy.classList.remove("success");
      btnCopy.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar enlace';
    }, 1800);

  } catch (err) {
    alert("No se pudo copiar el enlace al portapapeles.");
  }
});
