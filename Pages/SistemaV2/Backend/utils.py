# -*- coding: utf-8 -*-
# ============================================================
# ⚙️ UTILIDADES – SISTEMAV2 (Registra Perú)
# ============================================================

import os
import json
import datetime
import threading
from typing import Dict, List, Optional, Tuple, Any
import dotenv  # para leer variables del .env

# ============================================================
# 📂 CONFIGURACIÓN BASE Y RUTAS
# ============================================================

dotenv.load_dotenv(dotenv_path=r"C:\Proyectos\SistemaV2\config.env")

# Rutas principales
TEMP_PATH = os.getenv("TEMP_PATH", r"C:\Proyectos\SistemaV2\Data\temp_files")
_DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "comandos.json")

# Cache en memoria + control de concurrencia
_lock = threading.RLock()
_cache: Dict[str, List[Dict[str, Any]]] = {}
_cache_mtime: Optional[float] = None

# ============================================================
# 🪶 LOGGING SIMPLE
# ============================================================

def log(msg: str) -> None:
    print(f'![{datetime.datetime.now()} - {msg}]')

# ============================================================
# 📘 VALIDACIÓN Y CARGA DE comandos.json
# ============================================================

def _validar_estructura(data: dict):
    """Verifica que cada sección tenga una lista válida de comandos."""
    for seccion, comandos in data.items():
        if not isinstance(comandos, list):
            raise ValueError(f"La sección '{seccion}' no es una lista de comandos.")
        for cmd in comandos:
            if not isinstance(cmd, dict):
                raise ValueError(f"Comando inválido en '{seccion}': no es un diccionario.")
            for k in ["nombre", "descripcion"]:
                if k not in cmd or not isinstance(cmd[k], str):
                    raise ValueError(f"Comando inválido en '{seccion}' (falta '{k}' o no es string).")
    return data


def _leer_json() -> Dict[str, List[Dict[str, Any]]]:
    """Lee el archivo comandos.json desde disco."""
    if not os.path.exists(_DATA_FILE):
        raise FileNotFoundError(f"No se encontró comandos.json en: {_DATA_FILE}")
    with open(_DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return _validar_estructura(data)


def cargar_comandos(force_reload: bool = False) -> Dict[str, List[Dict[str, Any]]]:
    """Carga el JSON con cache automático y recarga si cambia el archivo."""
    global _cache, _cache_mtime
    with _lock:
        mtime = os.path.getmtime(_DATA_FILE) if os.path.exists(_DATA_FILE) else None
        if force_reload or _cache_mtime is None or mtime != _cache_mtime or not _cache:
            _cache = _leer_json()
            _cache_mtime = mtime
            log("✅ comandos.json cargado o actualizado.")
        return _cache


def recargar() -> Dict[str, List[Dict[str, Any]]]:
    """Recarga manual de comandos."""
    return cargar_comandos(force_reload=True)

# ============================================================
# 🧩 FUNCIONES PRINCIPALES (para API y Frontend)
# ============================================================

def secciones() -> List[str]:
    """Devuelve la lista de secciones disponibles (claves del JSON)."""
    data = cargar_comandos()
    return list(data.keys())


def listar_comandos(seccion: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retorna los comandos de una sección o todos combinados."""
    data = cargar_comandos()
    if seccion:
        sec = seccion.strip().upper()
        return list(data.get(sec, []))
    flat: List[Dict[str, Any]] = []
    for sec, items in data.items():
        for cmd in items:
            flat.append({"seccion": sec, **cmd})
    return flat


def buscar_comando(nombre: str) -> Optional[Tuple[str, Dict[str, Any]]]:
    """Busca un comando específico dentro de todas las secciones."""
    nombre = nombre.strip().lower()
    if not nombre:
        return None
    data = cargar_comandos()
    for sec, items in data.items():
        for cmd in items:
            if cmd.get("nombre", "").lower() == nombre:
                return sec, cmd
    return None


def tipo_respuesta_de(nombre: str) -> Optional[str]:
    """Obtiene tipo_respuesta ('texto', 'pdf', 'imagen', etc.) de un comando."""
    found = buscar_comando(nombre)
    return found[1].get("tipo_respuesta") if found else None

# ============================================================
# 🧱 UTILIDADES DE ARCHIVOS TEMPORALES
# ============================================================

def get_temp_path(filename: str = "") -> str:
    """Devuelve la ruta absoluta del archivo en la carpeta temporal."""
    return os.path.join(TEMP_PATH, filename)

def ensure_temp_dir() -> None:
    """Crea la carpeta temporal si no existe."""
    if not os.path.isdir(TEMP_PATH):
        os.makedirs(TEMP_PATH, exist_ok=True)
        log(f"📁 Carpeta temporal creada en: {TEMP_PATH}")
