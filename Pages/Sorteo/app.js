/* ============================================================
   SORTEO PRO — JS FÉNIX PRIME
   Fondo Animado + Confeti + Sistema Ultra Estable
=========================================================== */

/* --------------------------
   UTILIDADES
--------------------------- */
const $ = (q) => document.querySelector(q);
const byLine = (txt) => txt.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
const unique = (arr) => [...new Set(arr)];
const nowStr = () => new Date().toLocaleString();

/* --------------------------
   ESTADO
--------------------------- */
let participants = [];
let winners = [];
let spinning = false;
let rafSpin = null;
let currentName = null;

/* --------------------------
   ELEMENTOS
--------------------------- */
const namesEl = $("#names");
const countEl = $("#count");
const startBtn = $("#start");
const stopBtn = $("#stop");
const rerollBtn = $("#reroll");
const confirmBtn = $("#confirmWin");
const resetBtn = $("#reset");
const winnersEl = $("#winnersList");
const winsCountEl = $("#winsCount");
const viewer = $("#viewer");
const ticker = $("#ticker");
const winnersQty = $("#winners");
const noRepeat = $("#noRepeat");
const shuffleOnStart = $("#shuffleOnStart");
const accent = $("#accent");
const exportCsvBtn = $("#exportCsv");
const fullscreenBtn = $("#fullscreen");

/* ============================================================
   CANVAS FX — FONDO ANIMADO + CONFETI
=========================================================== */
const fx = document.getElementById("fx");
const ctx = fx.getContext("2d");

let particles = [];    // Fondo dinámico
let confetti = [];     // Confeti de celebración

function resizeCanvas() {
  fx.width = window.innerWidth;
  fx.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* -------- PARTICULAS FONDO -------- */
function createParticles() {
  const count = 70;
  particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * fx.width,
      y: Math.random() * fx.height,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    });
  }
}
createParticles();

/* -------- GENERAR CONFETI -------- */
function launchConfetti() {
  confetti = [];
  const n = 160;

  for (let i = 0; i < n; i++) {
    confetti.push({
      x: Math.random() * fx.width,
      y: -30 - Math.random() * 60,
      size: 4 + Math.random() * 6,
      angle: Math.random() * Math.PI * 2,
      velY: 2 + Math.random() * 3,
      rot: (Math.random() - 0.5) * 0.2,
      color: i % 2 === 0 ? accent.value : "#8b5cf6"
    });
  }
}

/* -------- LOOP GENERAL -------- */
function render() {
  ctx.clearRect(0, 0, fx.width, fx.height);

  /* Fondo animado (líneas conectadas) */
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > fx.width) p.vx *= -1;
    if (p.y < 0 || p.y > fx.height) p.vy *= -1;

    ctx.fillStyle = "rgba(167,139,250,0.75)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 140) {
        ctx.strokeStyle = `rgba(167,139,250, ${1 - dist / 140})`;
        ctx.lineWidth = 0.6;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  });

  /* Confeti */
  confetti.forEach(c => {
    c.y += c.velY;
    c.angle += c.rot;
    c.x += Math.sin(c.angle) * 1.4;

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.angle);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
    ctx.restore();
  });

  requestAnimationFrame(render);
}
render();

/* ============================================================
   PARTICIPANTES
=========================================================== */
function syncParticipants() {
  participants = unique(byLine(namesEl.value));
  countEl.textContent = participants.length;
}
namesEl.addEventListener("input", syncParticipants);

$("#clean").addEventListener("click", () => {
  namesEl.value = "";
  syncParticipants();
});

$("#dedupe").addEventListener("click", () => {
  namesEl.value = unique(byLine(namesEl.value)).join("\n");
  syncParticipants();
});

/* Cargar CSV */
$("#loadCsv").addEventListener("click", () => $("#csvInput").click());

$("#csvInput").addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) return;

  const reader = new FileReader();
  reader.onload = () => {
    const rows = reader.result.split(/\r?\n/);
    const firstCol = rows.map(r => r.split(",")[0]).filter(Boolean);
    namesEl.value = (namesEl.value ? namesEl.value + "\n" : "") + firstCol.join("\n");
    syncParticipants();
  };
  reader.readAsText(f, "utf-8");
});

/* ============================================================
   SORTEO
=========================================================== */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function spin() {
  const speed = 90;
  let last = 0;

  const loop = (t) => {
    if (!spinning) return cancelAnimationFrame(rafSpin);

    if (!last || t - last > speed) {
      const pool = noRepeat.checked
        ? participants.filter(p => !winners.some(w => w.name === p))
        : participants;

      ticker.textContent =
        pool.length === 0
          ? "No quedan elegibles"
          : currentName = pool[Math.floor(Math.random() * pool.length)];

      last = t;
    }

    rafSpin = requestAnimationFrame(loop);
  };
  rafSpin = requestAnimationFrame(loop);
}

function start() {
  syncParticipants();
  if (participants.length === 0) return alert("Agrega participantes primero.");

  if (shuffleOnStart.checked) participants = shuffle(participants);

  spinning = true;
  startBtn.disabled = true;
  stopBtn.disabled = false;
  rerollBtn.disabled = true;
  confirmBtn.disabled = true;

  ticker.classList.remove("stopped");
  spin();
}

function stop() {
  spinning = false;

  startBtn.disabled = false;
  stopBtn.disabled = true;
  rerollBtn.disabled = false;
  confirmBtn.disabled = false;

  ticker.classList.add("stopped");

  launchConfetti();
}

function addWinner(name) {
  if (!name) return;

  const item = { name, time: nowStr() };
  winners.push(item);
  winsCountEl.textContent = winners.length;

  const row = document.createElement("div");
  row.className = "winner";
  row.innerHTML = `
    <strong>${escapeHtml(name)}</strong>
    <small>${item.time}</small>
  `;
  winnersEl.prepend(row);

  if (winners.length >= Number(winnersQty.value)) {
    startBtn.disabled = true;
    confirmBtn.disabled = true;
    rerollBtn.disabled = true;
  }
}

function reroll() {
  if (spinning) return;
  start();
  setTimeout(stop, 1200 + Math.random() * 900);
}

function resetAll() {
  spinning = false;

  winners = [];
  winnersEl.innerHTML = "";
  winsCountEl.textContent = "0";

  ticker.textContent = "Listo para comenzar ✨";
  ticker.classList.remove("stopped");

  startBtn.disabled = false;
  stopBtn.disabled = true;
  rerollBtn.disabled = true;
  confirmBtn.disabled = true;
}

/* ============================================================
   EXPORTAR CSV
=========================================================== */
function exportCsv() {
  if (winners.length === 0)
    return alert("No hay ganadores para exportar.");

  const header = "Nombre,Fecha y hora\n";
  const body = winners
    .map(w => `"${w.name.replace(/"/g, '""')}","${w.time}"`)
    .join("\n");

  const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ganadores.csv";
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 500);
}

/* ============================================================
   COLOR ACENTO
=========================================================== */
accent.addEventListener("input", () => {
  viewer.style.setProperty("--accent", accent.value);
});

/* ============================================================
   PANTALLA COMPLETA
=========================================================== */
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
});

/* ============================================================
   HELPERS
=========================================================== */
function escapeHtml(s) {
  return s.replace(/[&<>"]/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[c]));
}

/* ============================================================
   INTRO LOADER
=========================================================== */
window.addEventListener("load", () => {
  setTimeout(() => {
    $("#intro").classList.add("hidden");
  }, 700);
});

/* INIT */
syncParticipants();
