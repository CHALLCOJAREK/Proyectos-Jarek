/* =========================================================
   NEO•TECH PREMIUM — SCRIPT PRINCIPAL (FÉNIX FIXED)
   Sistema de Tarjeta Digital Editable
========================================================= */
/* ============================================================
   CONSTELLATION CANVAS — Onix Silver Network (Fénix v4)
=========================================================== */

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const NUM = 75;                  // cantidad total de nodos
const DIST = 140;                // distancia para conectar líneas
const SPEED = 0.25;              // velocidad sutil

let nodes = [];

function init() {
  nodes = [];

  for (let i = 0; i < NUM; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 2 + 1
    });
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < NUM; i++) {
    const n = nodes[i];

    // Movimiento
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

    // Render punto
    ctx.beginPath();
    ctx.fillStyle = "rgba(56,189,248,0.85)"; // celeste frío premium
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();

    // Líneas entre nodos
    for (let j = i + 1; j < NUM; j++) {
      const n2 = nodes[j];
      const dx = n.x - n2.x;
      const dy = n.y - n2.y;
      const d = Math.hypot(dx, dy);

      if (d < DIST) {
        ctx.strokeStyle = `rgba(56,189,248,${1 - d / DIST})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(update);
}

init();
update();

/* ---------------------------
   INTRO / LOADER (Auto-hide)
--------------------------- */
const intro = document.getElementById("intro");

window.addEventListener("load", () => {
  setTimeout(() => {
    intro.classList.add("hide");
    setTimeout(() => {
      intro.style.display = "none";
      document.body.style.overflow = "auto";
    }, 600);
  }, 900);
});

/* ---------------------------
   INPUTS → PREVIEW
--------------------------- */
const map = {
  inputNombre: "previewNombre",
  inputCargo: "previewCargo",
  inputTelefono: "previewTelefono",
  inputEmail: "previewEmail",
  inputWeb: "previewWeb",
  inputLinkedin: "previewLinkedin",
};

function actualizarVista() {
  Object.keys(map).forEach(id => {
    const inp = document.getElementById(id);
    const out = document.getElementById(map[id]);
    if (inp && out) out.textContent = inp.value || "";
  });
}

/* Detectar cambios automáticamente */
document.querySelectorAll("input[type='text'], input[type='email']")
  .forEach(inp => inp.addEventListener("input", actualizarVista));


/* ---------------------------
   FOTO
--------------------------- */
const inputFoto = document.getElementById("inputFoto");
const previewFoto = document.getElementById("previewFoto");

inputFoto.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => previewFoto.src = reader.result;
  reader.readAsDataURL(file);
});

/* ---------------------------
   LOGO
--------------------------- */
const inputLogo = document.getElementById("inputLogo");
const previewLogo = document.getElementById("previewLogo");

inputLogo.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => previewLogo.src = reader.result;
  reader.readAsDataURL(file);
});

/* ---------------------------
   BOTÓN MANUAL: ACTUALIZAR
--------------------------- */
document.getElementById("btnActualizar")
  .addEventListener("click", actualizarVista);


/* ---------------------------
   GENERAR HTML
--------------------------- */
const codigoHtml = document.getElementById("codigoHtml");

document.getElementById("btnVerHtml").addEventListener("click", () => {
  const fotoHTML = previewFoto.src
    ? `<img src="${previewFoto.src}" style="width:80px;height:80px;border-radius:14px;object-fit:cover;">`
    : "";

  const logoHTML = previewLogo.src
    ? `<img src="${previewLogo.src}" style="width:80px;height:80px;border-radius:14px;object-fit:cover;">`
    : "";

  const htmlGenerado = `
<div style="font-family:Inter, sans-serif; max-width:420px;">
  <div style="display:flex; gap:20px; align-items:center; margin-bottom:10px;">
    ${fotoHTML}
    ${logoHTML}
  </div>

  <p style="font-size:18px;font-weight:700;margin:0;">${previewNombre.textContent}</p>
  <p style="font-size:14px;color:#666;margin:0 0 12px 0;">${previewCargo.textContent}</p>

  ${previewTelefono.textContent ? `<p style="margin:4px 0;">${previewTelefono.textContent}</p>` : ""}
  ${previewEmail.textContent ? `<p style="margin:4px 0;">${previewEmail.textContent}</p>` : ""}
  ${previewWeb.textContent ? `<p style="margin:4px 0;">${previewWeb.textContent}</p>` : ""}
  ${previewLinkedin.textContent ? `<p style="margin:4px 0;">${previewLinkedin.textContent}</p>` : ""}
</div>
  `;

  codigoHtml.textContent = htmlGenerado.trim();
});

/* ---------------------------
   EXPORTAR FIRMA OUTLOOK
--------------------------- */
document.getElementById("btnOutlook").addEventListener("click", () => {
  const htmlPlano = codigoHtml.textContent.trim();
  if (!htmlPlano) {
    alert("Primero genera el HTML.");
    return;
  }

  const blob = new Blob([htmlPlano], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "firma-outlook.html";
  a.click();

  URL.revokeObjectURL(url);
});
