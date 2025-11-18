# -*- coding: utf-8 -*-
# ============================================================
# REGISTRA PERÚ – Web API Inteligente (v3.0 para SistemaV2)
# ============================================================

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
from utils import listar_comandos, secciones, buscar_comando, ensure_temp_dir
from bot_handler import enviar_comando
import os, json, datetime, logging
from mimetypes import guess_type
from utils import get_temp_path, ensure_temp_dir

# ============================================================
# ⚙️ CONFIGURACIÓN BASE
# ============================================================

app = FastAPI(title="REGISTRA PERÚ – API", version="v3.0")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))       # C:\Proyectos\SistemaV2\Backend
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))    # C:\Proyectos\SistemaV2
FRONTEND_DIR = os.path.join(ROOT_DIR, "Frontend")           # C:\Proyectos\SistemaV2\Frontend

DATA_DIR = os.getenv("REGISTRA_DATA_DIR", r"C:\Proyectos\SistemaV2\Data")
TEMP_DIR = os.getenv("TEMP_PATH", get_temp_path())
ensure_temp_dir()

RESPUESTA_FILE = os.path.join(TEMP_DIR, "respuestas.json")

# ============================================================
# 🔐 CORS
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# 🧾 LOGGING
# ============================================================
LOG_DIR = os.path.join(ROOT_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, f"api_{datetime.datetime.now():%Y-%m-%d}.log")

logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    encoding="utf-8",
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    ip = request.client.host
    logging.info(f"📩 {request.method} {request.url} | Cliente: {ip}")
    response = await call_next(request)
    logging.info(f"✅ {response.status_code} - {request.url.path}")
    return response

# ============================================================
# 🧠 HELPERS
# ============================================================

def _safe_temp_path(nombre: str) -> str:
    """Evita path traversal y fuerza el archivo dentro de TEMP_DIR."""
    return os.path.join(TEMP_DIR, os.path.basename(nombre))

def _nocache_headers():
    """Cabeceras para evitar caché en respuestas."""
    return {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

# ============================================================
# 🚦 ENDPOINTS DE API
# ============================================================

@app.get("/health")
def health():
    return {"status": "ok", "msg": "Servidor activo"}

@app.get("/secciones")
def get_secciones():
    return {"secciones": secciones()}

@app.get("/comandos")
def get_comandos(seccion: str | None = None):
    data = listar_comandos(seccion)
    if not data:
        raise HTTPException(status_code=404, detail="No se encontraron comandos.")
    return {"total": len(data), "comandos": data}

@app.get("/consulta")
async def consulta(comando: str):
    """
    Llama al orquestador y deja la salida (texto/archivo) preparada.
    Tu bot_handler debería escribir 'respuestas.json' y, si aplica,
    el archivo generado dentro de TEMP_DIR.
    """
    ensure_temp_dir()
    resultado = await enviar_comando(comando)
    if resultado.get("status") == "error":
        raise HTTPException(status_code=500, detail=resultado.get("texto"))
    return resultado

# ------------------------------------------------------------
# 📄 LECTURA CONTROLADA DE respuestas.json (sin caché)
# ------------------------------------------------------------
@app.get("/respuesta")
def get_respuesta():
    if not os.path.exists(RESPUESTA_FILE):
        return JSONResponse(
            {"texto": "", "archivo": None},
            status_code=204,
            headers=_nocache_headers()
        )
    try:
        with open(RESPUESTA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        etag = str(int(os.path.getmtime(RESPUESTA_FILE)))
        headers = _nocache_headers()
        headers["ETag"] = etag
        return JSONResponse(data, headers=headers)
    except Exception as e:
        logging.exception("Error leyendo respuestas.json")
        raise HTTPException(status_code=500, detail=f"No se pudo leer la respuesta: {e}")

# ------------------------------------------------------------
# 📥 DESCARGA INTELIGENTE DE ARCHIVOS
# ------------------------------------------------------------
@app.get("/descargar/{nombre_archivo}")
def descargar_archivo(nombre_archivo: str):
    file_path = _safe_temp_path(nombre_archivo)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="El archivo no se encontró en el servidor.")

    media_type, _ = guess_type(file_path)
    headers = _nocache_headers()
    return FileResponse(
        file_path,
        media_type=media_type or "application/octet-stream",
        filename=os.path.basename(file_path),
        headers=headers
    )

# HEAD para verificar si el archivo existe
@app.head("/exists/{nombre_archivo}")
def existe_archivo(nombre_archivo: str):
    file_path = _safe_temp_path(nombre_archivo)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="No existe")
    return Response(status_code=204, headers=_nocache_headers())

# ============================================================
# 🌐 FRONTEND Y ARCHIVOS ESTÁTICOS
# ============================================================

# Archivos temporales (JSON, PDF, etc.)
app.mount("/temp_files", StaticFiles(directory=TEMP_DIR, html=False), name="temp_files")

# Archivos del Frontend (si existen)
if os.path.exists(FRONTEND_DIR):
    # Sirve la subcarpeta Frontend/static en la URL /static
    app.mount("/static", StaticFiles(directory=os.path.join(FRONTEND_DIR, "static")), name="static")


    @app.get("/", response_class=HTMLResponse)
    async def serve_index():
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            with open(index_path, "r", encoding="utf-8") as f:
                html = f.read()
            return HTMLResponse(content=html, status_code=200, headers=_nocache_headers())
        return HTMLResponse("<h3>⚠️ index.html no encontrado en /Frontend</h3>", status_code=404)
else:
    @app.get("/", response_class=HTMLResponse)
    async def no_frontend():
        return HTMLResponse("<h3>⚠️ Carpeta Frontend no encontrada</h3>", status_code=404)

@app.get("/debug/tempdir")
def debug_tempdir():
    return {
        "TEMP_DIR": TEMP_DIR,
        "exists": os.path.exists(TEMP_DIR),
        "archivos": os.listdir(TEMP_DIR)
    }

# ============================================================
# 🧩 INICIO DEL SERVIDOR
# ============================================================
print("🚀 REGISTRA PERÚ iniciado correctamente")
print(f"🌎 Frontend: {FRONTEND_DIR}")
print(f"📁 Datos: {DATA_DIR}")
print(f"🗂 Logs:  {LOG_FILE}")
print(f"📦 Temp:  {TEMP_DIR}")