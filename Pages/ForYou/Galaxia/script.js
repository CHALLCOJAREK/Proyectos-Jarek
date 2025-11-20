// ======================================================
//  Galaxia de Amor – Versión limpia para Jarek 💙
//  - Sin verificaciones raras
//  - Editable 100%
//  - Con loader, estrellas, three.js, audio y galería
// ======================================================

let scene, camera, renderer, controls;
let font;
let rotatingImageMesh, rotatingImageMaterial;
let stickerTextures = [];
let floatingWords = [];
let ringTexts = [];
let lastTextureSwitch = 0;
let currentTextureIndex = 0;

const IMAGE_URLS = [
  "https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/GIF/gatito.gif",
  "https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/GIF/img.gif",
  "https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/GIF/Gatitosi.gif",
  "https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/GIF/Gatito1.gif"
];

const RING_TEXT = "TE AMO CON TODO MI CORAZÓN Y ALMA PARA SIEMPRE MI AMOR ETERNO";

const FLOATING_WORDS = [
   // Básicas
  "MI AMOR", "MI LUZ", "MI PAZ", "MI DESTINO", "MI FUTURO", "MI HOY", "MI TODO",
  "MI ÁNGEL", "MI SONRISA", "MI RISITA", "MI VIDA", "MI ALMA", "MI SERENIDAD",
  "MI SUEÑO", "MI PASIÓN", "MI FUERZA", "MI REFUGIO", "MI TESORO",

  // Nivel poético
  "MI CONSTELACIÓN", "MI UNIVERSO", "MI VIA LÁCTEA", "MI ESTRELLA GUÍA",
  "MI HOGAR", "MI ABRIGO", "MI LATIDO", "MI CIELO", "MI ESPERANZA",
  "MI RESPIRACIÓN", "MI CALMA ETERNA", "MI RAZÓN", "MI FE", "MI NORTE",
  "MI EQUILIBRIO", "MI FRAGANCIA", "MI ENERGÍA", "MI SINFONÍA",
  "MI MAGIA", "MI AURORA", "MI OCÉANO", "MI VIBRA", "MI POESÍA",

  // Tier romántico profundo
  "MI CORAZÓN", "MI COMPAÑERA", "MI ENAMORADA", "MI CHISPA",
  "MI SUAVIDAD", "MI ABRAZO FAVORITO", "MI MOMENTO PERFECTo",
  "MI CARICIA", "MI PENSAMIENTO BONITO", "MI REFLEJO", "MI LATIDO AZUL",
  "MI DESTELLO", "MI CALOR", "MI SUEÑO PROFUNDO", "MI MILAGRO",

  // Palabras con emoción suave
  "MI BRISA", "MI CALIDEZ", "MI MAREA", "MI ENCUENTRO",
  "MI DULZURA", "MI TRAVESÍA", "MI LUZ SUAVE", "MI NOCHE ESTRELLADA",
  "MI AMANECER", "MI SUSPIRO", "MI NOTA FINAL", "MI ARMONÍA",

  // Más estéticas
  "MI CONSTANTE", "MI ECO", "MI SECRETO", "MI DESTELLO",
  "MI PERFECCIÓN", "MI AVENTURA", "MI HISTORIA", "MI CAMINO",
  "MI NEBULOSA", "MI ORBITA", "MI FRAGILIDAD HERMOSA",

  // God-tier romántico
  "MI MITO FAVORITO", "MI INMENSIDAD", "MI TIEMPO", "MI PARA SIEMPRE",
  "MI RENACER", "MI FORTALEZA", "MI BELLEZA", "MI SANTUARIO",
  "MI FRAGMENTO DE CIELO", "MI ETERNIDAD", "MI AMOR BONITO",
  "MI ABRAZO PENDIENTE", "MI DESTINO SUAVE", "MI LUZ DEL ALMA",
  "MI TODO LO BONITO",

  // Añadidas especiales para Julissa
  "MI JULI", "MI JULISSA", "MI NIÑA", "MI AZULITO", 
  "MI FAVORITA", "MI CONSENTIDA", "MI ELEGIDA"
];

const GALLERY_MESSAGES = [
  "Mi corazón late por ti",
  "Tu sonrisa es mi mayor tesoro",
  "Eres la luz que ilumina mi vida cada día",
  "Cada momento a tu lado es un regalo del universo"
];

let audioEnabled = false;

// ======================================================
// Utilidad: animación de texto flotando en la pantalla
// ======================================================

function injectTextExplosionKeyframes() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes animacionExplosionTexto {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(3);
      }
    }
  `;
  document.head.appendChild(style);
}

// ======================================================
// Estrellas en el fondo (DOM, no three.js)
// ======================================================

function createDomStars(count = 120) {
  const sky = document.getElementById("cielo-estrellas");
  if (!sky) return;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.classList.add("estrella");

    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.setProperty("--retraso", `${Math.random() * 5}s`);
    star.style.setProperty("--duracion", `${Math.random() * 4 + 2}s`);

    sky.appendChild(star);
  }
}

// ======================================================
// Loader bonito (For You 0% → 100%)
// ======================================================

function startLoader() {
  return new Promise((resolve) => {
    const reloj = document.getElementById("cargador-reloj");
    const texto = document.getElementById("texto-progreso");
    const puntos = document.getElementById("puntos-cargando");

    let progreso = 0;
    let puntosEstado = 0;

    const puntosInterval = setInterval(() => {
      puntosEstado = (puntosEstado + 1) % 4;
      puntos.textContent = ".".repeat(puntosEstado) || "...";
    }, 300);

    const interval = setInterval(() => {
      progreso++;
      if (reloj) reloj.style.setProperty("--progreso", `${progreso}%`);
      if (texto) texto.textContent = `${progreso}%`;

      if (progreso >= 100) {
        clearInterval(interval);
        clearInterval(puntosInterval);
        resolve();
      }
    }, 30); // ~3s
  });
}

// ======================================================
// Carga de recursos three.js
// ======================================================

async function loadThreeResources() {
  const textureLoader = new THREE.TextureLoader();
  const fontLoader = new THREE.FontLoader();

  // Texturas
  for (const url of IMAGE_URLS) {
    const tex = await textureLoader.loadAsync(url);
    stickerTextures.push(tex);
  }

  // Fuente
  font = await new Promise((resolve) => {
    fontLoader.load(
      "https://threejs.org/examples/fonts/gentilis_regular.typeface.json",
      (loadedFont) => resolve(loadedFont),
      undefined,
      () => resolve(null) // si falla, seguimos sin fuente
    );
  });
}

// ======================================================
// Escena base
// ======================================================

function createScene() {
  scene = new THREE.Scene();
  scene.background = null;
}

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 8, 30);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  document
    .getElementById("contenedor-escena")
    .appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.5;

  window.addEventListener("resize", onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ======================================================
// Luces
// ======================================================

function createLights() {
  scene.add(new THREE.AmbientLight(0x88aaff, 0.4));

  const dir = new THREE.DirectionalLight(0xaaffff, 1.5);
  dir.position.set(10, 10, 5);
  dir.castShadow = true;
  scene.add(dir);

  const fill = new THREE.PointLight(0xeeffff, 0.8, 50);
  fill.position.set(0, 5, 10);
  scene.add(fill);

  const back = new THREE.DirectionalLight(0x4477ff, 0.6);
  back.position.set(-5, -5, -5);
  scene.add(back);
}

// ======================================================
// Imagen rotatoria central
// ======================================================

function createRotatingImage() {
  const geometry = new THREE.PlaneGeometry(8, 8);
  rotatingImageMaterial = new THREE.MeshStandardMaterial({
    map: stickerTextures[0],
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
  });

  rotatingImageMesh = new THREE.Mesh(geometry, rotatingImageMaterial);
  rotatingImageMesh.position.set(0, 0, 0);
  scene.add(rotatingImageMesh);
}

// ======================================================
// Anillos y texto circular
// ======================================================

function createRingsAndText() {
  // Anillo interior
  const ringInnerGeom = new THREE.RingGeometry(4.8, 5.2, 64);
  const ringInnerMat = new THREE.MeshPhongMaterial({
    color: 0x00eeff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
    emissive: 0x003366
  });
  const ringInner = new THREE.Mesh(ringInnerGeom, ringInnerMat);
  ringInner.rotation.x = Math.PI / 2 + 0.1;
  scene.add(ringInner);

  // Anillo exterior
  const ringOuterGeom = new THREE.RingGeometry(8.8, 9.2, 64);
  const ringOuterMat = new THREE.MeshPhongMaterial({
    color: 0x00eeff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.25,
    emissive: 0x002244
  });
  const ringOuter = new THREE.Mesh(ringOuterGeom, ringOuterMat);
  ringOuter.rotation.x = Math.PI / 2 + 0.1;
  scene.add(ringOuter);

  // Texto en círculo (si hay fuente)
  if (!font) return;

  const radius = 7;
  const chars = RING_TEXT.length;
  const step = (Math.PI * 2) / chars;

  for (let i = 0; i < chars; i++) {
    const ch = RING_TEXT[i];
    if (ch === " ") continue;

    const geo = new THREE.TextGeometry(ch, {
      font,
      size: 0.4,
      height: 0.05,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.02,
      bevelSegments: 3
    });
    geo.computeBoundingBox();
    geo.center();

    const mat = new THREE.MeshPhongMaterial({
      color: 0x00eeff,
      emissive: 0x003366,
      specular: 0x88bbff,
      shininess: 80,
      transparent: true,
      opacity: 0.9
    });

    const mesh = new THREE.Mesh(geo, mat);
    const angle = -i * step;

    mesh.position.x = Math.cos(angle) * radius;
    mesh.position.z = Math.sin(angle) * radius;
    mesh.position.y = 0;
    mesh.rotation.y = angle + Math.PI;
    mesh.rotation.x = Math.PI / 2;

    scene.add(mesh);
    ringTexts.push(mesh);
  }
}

// ======================================================
// Palabras flotantes alrededor
// ======================================================

function createFloatingWords() {
  if (!font) return;

  FLOATING_WORDS.forEach((word, idx) => {
    const geo = new THREE.TextGeometry(word, {
      font,
      size: 0.5,
      height: 0.08,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.03,
      bevelSegments: 3
    });
    geo.computeBoundingBox();
    geo.center();

    const mat = new THREE.MeshPhongMaterial({
      color: 0x00eeff,
      emissive: 0x004477,
      transparent: true,
      opacity: 0.9
    });

    const mesh = new THREE.Mesh(geo, mat);

    const radius = 12 + Math.random() * 6;
    const angle = Math.random() * Math.PI * 2;
    const baseY = (Math.random() - 0.5) * 6;

    mesh.position.set(
      Math.cos(angle) * radius,
      baseY,
      Math.sin(angle) * radius
    );
    scene.add(mesh);

    floatingWords.push({
      mesh,
      baseY,
      radius,
      angle,
      speed: 0.1 + Math.random() * 0.2,
      phase: idx * 0.3
    });
  });
}

// ======================================================
// Estrellas 3D (puntos)
// ======================================================

function createStarField() {
  const geometry = new THREE.BufferGeometry();
  const count = 8000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 400;
    positions[i + 1] = (Math.random() - 0.5) * 400;
    positions[i + 2] = (Math.random() - 0.5) * 400;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.2,
    transparent: true,
    opacity: 0.7
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
}

// ======================================================
// Animación principal
// ======================================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Rotación imagen central
  if (rotatingImageMesh) {
    rotatingImageMesh.rotation.y += 0.0025;
  }

  // Cambio de textura cada 5s
  const now = performance.now();
  if (now - lastTextureSwitch > 5000 && stickerTextures.length > 0) {
    lastTextureSwitch = now;
    currentTextureIndex = (currentTextureIndex + 1) % stickerTextures.length;
    rotatingImageMaterial.map = stickerTextures[currentTextureIndex];
    rotatingImageMaterial.needsUpdate = true;
  }

  // Flotación de palabras
  floatingWords.forEach((obj, i) => {
    obj.angle += obj.speed * 0.0015;
    obj.mesh.position.x = Math.cos(obj.angle) * obj.radius;
    obj.mesh.position.z = Math.sin(obj.angle) * obj.radius;
    obj.mesh.position.y =
      obj.baseY + Math.sin(elapsed * 0.8 + obj.phase) * 1.5;

    obj.mesh.lookAt(camera.position);
  });

  // Texto del anillo mirando al centro
  ringTexts.forEach((t) => t.lookAt(camera.position));

  controls.update();
  renderer.render(scene, camera);
}

// ======================================================
// UI: Audio, toques, galería, modal
// ======================================================

function initUIEvents() {
  injectTextExplosionKeyframes();

  // Botón de audio
  const btnAudio = document.getElementById("alternar-audio");
  btnAudio.addEventListener("click", () => toggleAudio());

  // Un primer click/touch en la pantalla enciende el audio y lanza efecto
  document.addEventListener("click", handleTouch);
  document.addEventListener("touchstart", handleTouch);

  // Galería → abrir modal
  document
    .querySelectorAll(".elemento-galeria")
    .forEach((el) => el.addEventListener("click", openGalleryModal));

  // Cerrar modal
  document
    .querySelector(".boton-cerrar")
    .addEventListener("click", closeModal);
  document.getElementById("modal-imagen").addEventListener("click", (e) => {
    if (e.target.id === "modal-imagen") closeModal();
  });
}

function toggleAudio(forceOn = false) {
  const audio = document.getElementById("audio-fondo");
  const btn = document.getElementById("alternar-audio");

  if (forceOn) audioEnabled = true;
  else audioEnabled = !audioEnabled;

  if (audioEnabled) {
    audio
      .play()
      .then(() => {
        btn.textContent = "ON";
        btn.style.background = "rgba(0, 238, 255, 0.3)";
      })
      .catch(() => {
        // Si el navegador bloquea el autoplay, no hacemos drama
        audioEnabled = false;
        btn.textContent = "OFF";
        btn.style.background = "rgba(255,255,255,0.15)";
      });
  } else {
    audio.pause();
    btn.textContent = "OFF";
    btn.style.background = "rgba(255,255,255,0.15)";
  }
}

let touchCounter = 0;

function handleTouch(e) {
  // Evitar que el click en la galería o en el modal dispare esto
  if (
    e.target.closest(".elemento-galeria") ||
    e.target.closest(".modal") ||
    e.target.id === "alternar-audio"
  ) {
    return;
  }

  if (!audioEnabled) {
    toggleAudio(true);
  }

  touchCounter++;
  updateInstructions();

  const clientX =
    e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
  const clientY =
    e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

  showTouchIndicator(clientX, clientY);
  spawnFloatingText(clientX, clientY);
}

function updateInstructions() {
  const instrucciones = document.getElementById("instrucciones");
  if (!instrucciones) return;

  if (touchCounter === 5) {
    instrucciones.textContent =
      "¡Eres increíble! Cada toque es un latido de mi corazón ❤️";
  } else if (touchCounter === 10) {
    instrucciones.textContent = "Eres el amor de mi vida 💙";
  } else if (touchCounter >= 15) {
    const mensajes = [
      "Eres mi razón de ser",
      "Eres mi sueño hecho realidad",
      "Te amo más cada día",
      "Eres mi todo"
    ];
      instrucciones.textContent =
        mensajes[Math.floor(Math.random() * mensajes.length)];
  }
}

function showTouchIndicator(x, y) {
  const indicador = document.getElementById("indicador-toque");
  if (!indicador) return;

  indicador.style.left = `${x}px`;
  indicador.style.top = `${y}px`;
  indicador.style.opacity = "1";

  setTimeout(() => {
    indicador.style.opacity = "0";
  }, 300);
}

function spawnFloatingText(x, y) {
  const mensajes = [
  // Los clásicos
  "MI AMOR",
  "MI LUZ",
  "MI VIDA",
  "MI TODO",
  "MI CORAZÓN",
  "TE AMO",
  "ERES ÚNICA",

  // Nuevos intensos
  "MI TESORO",
  "MI DESTINO",
  "MI UNIVERSo",
  "MI CIELO",
  "MI ÁNGEL",
  "MI SOL",
  "MI ESTRELLA",

  // Poéticos cortos
  "MI LATIDO",
  "MI SUEÑO",
  "MI CALMA",
  "MI FORTALEZA",
  "MI ENERGÍA",

  // Golpe directo al corazón
  "TE QUIERO",
  "TE ADORO",
  "TE EXTRAÑO",
  "TE NECESITO",

  // Dulces y suaves
  "MI BELLA",
  "MI NIÑA",
  "MI JULI",
  "MI AMORCITO"
];

  const msg = mensajes[Math.floor(Math.random() * mensajes.length)];

  const el = document.createElement("div");
  el.textContent = msg;
  el.style.position = "absolute";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.transform = "translate(-50%, -50%)";
  el.style.fontSize = "24px";
  el.style.fontWeight = "bold";
  el.style.color = "#00eeff";
  el.style.textShadow = "0 0 10px #00eeff";
  el.style.zIndex = "20";
  el.style.pointerEvents = "none";
  el.style.animation = "animacionExplosionTexto 1.5s ease-out forwards";

  document.getElementById("superposicion-ui").appendChild(el);

  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 1600);
}

// ======================================================
// Modal de galería
// ======================================================

function openGalleryModal(e) {
  const card = e.currentTarget;
  const index = parseInt(card.getAttribute("data-indice"), 10) || 0;

  const imgSrc = card.querySelector("img").src;

  const modal = document.getElementById("modal-imagen");
  const modalImg = document.getElementById("imagen-modal");
  const modalMsg = document.getElementById("mensaje-modal");

  modalImg.src = imgSrc;
  modalMsg.textContent =
    GALLERY_MESSAGES[index % GALLERY_MESSAGES.length] ||
    "Eres mi sueño hecho realidad";

  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("modal-imagen");
  modal.style.display = "none";
}

// ======================================================
// Inicio de todo
// ======================================================

async function initApp() {
  createDomStars(150);
  await startLoader();

  const cargando = document.getElementById("cargando");
  if (cargando) cargando.style.display = "none";

  await loadThreeResources();

  createScene();
  createCamera();
  createRenderer();
  createLights();
  createRotatingImage();
  createRingsAndText();
  createFloatingWords();
  createStarField();
  initUIEvents();
  animate();
}


document.addEventListener("DOMContentLoaded", initApp);
