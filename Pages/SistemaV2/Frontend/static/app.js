// ============================================================
// REGISTRA PERÚ – FRONTEND (secciones -> comandos -> consulta)
// Mejorado: parseo y renderizado estilizado de respuestas
// ============================================================

const API_URL = window.location.origin;
const RESPUESTA_URL = `${API_URL}/temp_files/respuestas.json`;

const listaSecciones = document.getElementById("lista-secciones");
const resultadoDiv = document.getElementById("resultado");

// -------- util toast -------
function toast(msg, color = "#2563eb") {
  const old = document.querySelector(".toast-popup");
  if (old) old.remove();
  const t = document.createElement("div");
  t.className = "toast-popup";
  t.textContent = msg;
  Object.assign(t.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: color,
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: "9999",
    opacity: "0",
    transform: "translateY(-12px)",
    transition: "opacity .3s, transform .3s",
  });
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = "1"; t.style.transform = "translateY(0)"; }, 20);
  setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateY(-12px)"; setTimeout(() => t.remove(), 300); }, 2500);
}

// -------- estado inicial -------
function estadoInicial() {
  resultadoDiv.innerHTML = `
    <div class="resultado">
      <strong>📂 Estado del Panel:</strong>
      <div style="margin-top:8px; color:#9ba4b5">
        Selecciona una sección a la izquierda para ver sus comandos.
      </div>
    </div>
  `;
}

// -------- cargar secciones -------
document.addEventListener("DOMContentLoaded", async () => {
  estadoInicial();
  try {
    const res = await fetch(`${API_URL}/secciones`, { cache: "no-store" });
    const data = await res.json();
    listaSecciones.innerHTML = "";
    (data.secciones || []).forEach((sec) => {
      const li = document.createElement("li");
      li.textContent = sec;
      li.onclick = () => seleccionarSeccion(sec, li);
      listaSecciones.appendChild(li);
    });
  } catch (e) {
    listaSecciones.innerHTML = `<li style="color:#f87171;">❌ No se pudieron cargar las secciones</li>`;
  }
});

// -------- seleccionar sección -> cargar comandos -------
async function seleccionarSeccion(nombre, liEl) {
  document.querySelectorAll(".sidebar-nav li").forEach(li => li.classList.remove("active"));
  liEl.classList.add("active");

  resultadoDiv.innerHTML = `
    <div class="resultado">
      <div style="color:#60a5fa">📦 Cargando comandos de <strong>${nombre}</strong>...</div>
    </div>
  `;

  try {
    const res = await fetch(`${API_URL}/comandos?seccion=${encodeURIComponent(nombre)}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const comandos = data.comandos || [];
    if (!comandos.length) {
      resultadoDiv.innerHTML = `
        <div class="resultado">
          <div style="color:#fbbf24">⚠️ No hay comandos para <strong>${nombre}</strong>.</div>
        </div>
      `;
      return;
    }

    // grid de tarjetas de comando
    let html = `
      <div class="resultado">
        <h3>🧭 Comandos de <strong>${nombre}</strong></h3>
        <div class="comandos-grid">
    `;
    for (const cmd of comandos) {
      const titulo = cmd.titulo || cmd.nombre || "Comando";
      const desc = cmd.descripcion || "";
      const tipo = (cmd.tipo_respuesta || "texto").toUpperCase();
      // guardamos comando en data-attr (escapando comillas simples)
      html += `
        <div class="command-card" data-cmd='${JSON.stringify(cmd).replace(/'/g, "&apos;")}'>
          <h3>${titulo}</h3>
          <p>${desc}</p>
          <div style="font-size:.8em; color:#9ba4b5; margin-bottom:10px;">Tipo: ${tipo}</div>
          <button class="btn-run" type="button">Seleccionar</button>
        </div>
      `;
    }
    html += `</div></div>`;
    resultadoDiv.innerHTML = html;

    document.querySelectorAll(".command-card .btn-run").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const card = e.target.closest(".command-card");
        const cmd = JSON.parse(card.getAttribute("data-cmd").replace(/&apos;/g, "'"));
        mostrarFormularioConsulta(cmd);
      });
    });

  } catch (e) {
    resultadoDiv.innerHTML = `
      <div class="resultado">
        <div style="color:#f87171;">❌ Error al cargar comandos: ${e.message}</div>
      </div>
    `;
  }
}

// -------- mostrar formulario según comando -------
function mostrarFormularioConsulta(cmd) {
  const nombreCmd = (cmd.nombre || "").toLowerCase();
  let form = "";
  let ayuda = "";

  if (nombreCmd.startsWith("/nm")) {
    ayuda = `<p style="color:#9ba4b5; font-size:.9em;">Formato: <code>/nm nombre|apellidopaterno|apellidomaterno</code></p>`;
    form = `
      <div class="resultado">
        <h3>📌 ${cmd.titulo || cmd.nombre}</h3>
        <div class="resultado-content">
          ${ayuda}
          <div class="form-group" style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px;">
            <div><label>Nombre</label><input type="text" id="nm_nombre" placeholder="Nombre(s)"></div>
            <div><label>Apellido Paterno</label><input type="text" id="nm_ap1" placeholder="Paterno"></div>
            <div><label>Apellido Materno</label><input type="text" id="nm_ap2" placeholder="Materno"></div>
          </div>
          <div style="margin-top:12px;">
            <button id="btnEjecutar" class="btn-run">Consultar</button>
          </div>
          <div id="zonaResultado" style="margin-top:12px;"></div>
        </div>
      </div>
    `;
  } else {
    form = `
      <div class="resultado">
        <h3>📌 ${cmd.titulo || cmd.nombre}</h3>
        <div class="resultado-content">
          <div class="form-group">
            <label>Dato requerido</label>
            <input type="text" id="dato_generico" placeholder="Ej: 12345678">
          </div>
          <div style="margin-top:12px;">
            <button id="btnEjecutar" class="btn-run">Consultar</button>
          </div>
          <div id="zonaResultado" style="margin-top:12px;"></div>
        </div>
      </div>
    `;
  }

  resultadoDiv.innerHTML = form;

  // añadir listener al botón después de insertar el HTML
  document.getElementById("btnEjecutar").addEventListener("click", async () => {
    await ejecutarConsulta(cmd);
  });
}

// -------- ejecutar consulta -------
async function ejecutarConsulta(cmd) {
  const zona = document.getElementById("zonaResultado");
  zona.innerHTML = `<div style="color:#d4af37;">⏳ Procesando tu solicitud...</div>`;

  const nombreCmd = (cmd.nombre || "").toLowerCase();
  let comandoFinal = cmd.nombre || "";

  if (nombreCmd.startsWith("/nm")) {
    const n = (document.getElementById("nm_nombre").value || "").trim();
    const a1 = (document.getElementById("nm_ap1").value || "").trim();
    const a2 = (document.getElementById("nm_ap2").value || "").trim();
    if (!n || !a1 || !a2) {
      zona.innerHTML = `<div style="color:#f87171;">⚠️ Completa nombre y ambos apellidos.</div>`;
      return;
    }
    comandoFinal = `${cmd.nombre} ${n}|${a1}|${a2}`;
  } else {
    const dato = (document.getElementById("dato_generico").value || "").trim();
    if (!dato) {
      zona.innerHTML = `<div style="color:#f87171;">⚠️ Ingresa un dato válido.</div>`;
      return;
    }
    comandoFinal = `${cmd.nombre} ${dato}`;
  }

  try {
    toast("🚀 Enviando comando...", "#2563eb");
    const resp = await fetch(`${API_URL}/consulta?comando=${encodeURIComponent(comandoFinal)}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    // el bot puede tardar; hacemos polling del JSON
    await esperarYMostrarResultado(cmd.titulo || cmd.nombre);
  } catch (e) {
    zona.innerHTML = `<div style="color:#f87171;">❌ Error en la consulta: ${e.message}</div>`;
    toast("❌ Error en la consulta", "#dc2626");
  }
}

// -------- polling de respuestas.json -------
async function esperarYMostrarResultado(titulo) {
  const zona = document.getElementById("zonaResultado");
  const intentos = 90;        // hasta ~90s
  const intervalo = 1000;     // 1s

  for (let i = 0; i < intentos; i++) {
    try {
      const res = await fetch(`${RESPUESTA_URL}?_=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        // si tenemos data y texto/archivo, lo renderizamos
        if (data && (data.texto || (data.archivos && data.archivos.length))) {
          renderResultado(data, titulo);
          toast("✅ Consulta completada", "#059669");
          return;
        }
      }
    } catch (_) {}
    await new Promise(r => setTimeout(r, intervalo));
  }

  zona.innerHTML = `<div style="color:#fbbf24;">⌛ El bot sigue procesando... revisa en unos segundos.</div>`;
  toast("⌛ El bot sigue procesando...", "#f59e0b");
}

// -------- utilidades para formatear la respuesta -------
function escapeHtml(s) {
  if (!s) return "";
  return s.replace(/[&<>"'`]/g, (c) => {
    return ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;"
    })[c];
  });
}

function mdBoldToStrong(text) {
  // convierte **texto** en <strong>texto</strong>
  return text.replace(/\*\*(.+?)\*\*/g, (_, p1) => `<strong>${escapeHtml(p1)}</strong>`);
}

function inlineCodeToCode(text) {
  // convierte `algo` en <code>algo</code>
  return text.replace(/`([^`]+?)`/g, (_, p1) => `<code>${escapeHtml(p1)}</code>`);
}

// limpia líneas decorativas y bloques irrelevantes
function limpiarBloques(texto) {
  if (!texto) return "";
  // quitar filas con patrones repetitivos u ornamental
  const lines = texto.split(/\r?\n/).map(l => l.trim());
  const filt = lines.filter(l => {
    if (!l) return false;
    // patrones a eliminar:
    if (/^•+|^[-*_]{3,}|^\[.*#FenixBot.*\]|\[.*FenixBot.*\]/i.test(l)) return false;
    if (/FenixCoins/i.test(l)) return false;
    if (/web oficial|canal oficial/i.test(l)) return false;
    return true;
  });
  return filt.join("\n");
}

// intenta extraer pares LABEL: valor en formato **LABEL:** value
function parsearPares(texto) {
  const rows = [];
  const others = [];
  const lines = texto.split(/\r?\n/);
  for (const l of lines) {
    // busca patrón **LABEL:** value   (puede tener espacios)
    const m = l.match(/^\s*\*\*(.+?)\*\*\s*:\s*(.+)\s*$/);
    if (m) {
      rows.push({ label: m[1].trim(), value: m[2].trim() });
    } else {
      // también acepta líneas como **LABEL:**value (sin espacio)
      const m2 = l.match(/^\s*\*\*(.+?)\*\*\s*(.+)$/);
      if (m2) {
        rows.push({ label: m2[1].trim(), value: m2[2].trim() });
      } else {
        others.push(l);
      }
    }
  }
  return { rows, others };
}

// -------- renderizar resultado + descarga -------
function renderResultado(data, titulo) {
  const zona = document.getElementById("zonaResultado");

  // limpia y procesa el texto
  let texto = (data.texto || "").trim();
  texto = limpiarBloques(texto);

  const parsed = parsearPares(texto);

  // construir HTML estilizado
  let html = `<div class="resultado"><h4 style="margin-top:0">${escapeHtml(titulo)}</h4>`;

  if (parsed.rows.length) {
    html += `<div style="margin-top:8px; border-radius:10px; padding:12px; background:#0f1720; border:1px solid rgba(255,255,255,0.03);">
      <table style="width:100%; border-collapse:collapse; font-family:inherit; color:var(--color-text);">
        <tbody>`;
    for (const r of parsed.rows) {
      html += `
        <tr>
          <td style="width:32%; padding:8px 10px; color:#9ba4b5; vertical-align:top;"><strong>${escapeHtml(r.label)}</strong></td>
          <td style="padding:8px 10px; vertical-align:top; font-family:monospace; color:#d1d5db;">${inlineCodeToCode(mdBoldToStrong(r.value))}</td>
        </tr>
      `;
    }
    html += `</tbody></table></div>`;
  }

  // mostrar líneas restantes (others) como párrafos
  if (parsed.others && parsed.others.length) {
    html += `<div style="margin-top:12px; color:#d1d5db; white-space:pre-wrap;">`;
    const otherText = parsed.others.join("\n").trim();
    // convierte **bold** dentro del resto
    const converted = inlineCodeToCode(mdBoldToStrong(escapeHtml(otherText)));
    html += converted;
    html += `</div>`;
  }

  // si hay archivo(s), mostrar botones de descarga
  if (data.archivos && data.archivos.length) {
    html += `<div style="margin-top:12px;">`;
    for (const a of data.archivos) {
      const nombre = a.split("/").pop();
      html += `<button class="btn-run" style="margin-right:8px" data-file="${escapeHtml(nombre)}">📥 ${escapeHtml(nombre)}</button>`;
    }
    html += `</div>`;
  } else if (data.archivo) {
    // compatibilidad con clave singular 'archivo'
    const nombre = data.archivo.split("/").pop();
    html += `<div style="margin-top:12px;"><button class="btn-run" data-file="${escapeHtml(nombre)}">📥 ${escapeHtml(nombre)}</button></div>`;
  }

  html += `</div>`; // cierre resultado

  zona.innerHTML = html;

  // añadir listeners a botones de descarga
  zona.querySelectorAll("button[data-file]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const f = e.currentTarget.getAttribute("data-file");
      if (f) descargarArchivo(f);
    });
  });
}

// -------- descarga de archivo -------
async function descargarArchivo(nombre) {
  try {
    const url = `${API_URL}/descargar/${encodeURIComponent(nombre)}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Archivo no encontrado");
    const blob = await resp.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast(`✅ Descargado: ${nombre}`, "#059669");
  } catch (e) {
    toast(`🚫 No se pudo descargar: ${nombre}`, "#dc2626");
  }
}
