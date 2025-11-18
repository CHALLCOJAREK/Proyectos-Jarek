# -*- coding: utf-8 -*-
# ============================================================
# REGISTRA PERÚ – BOT HANDLER INTELIGENTE (v3.1 SistemaV2)
# ============================================================

import os
import asyncio
import datetime
import json
from telethon import TelegramClient, errors
from dotenv import load_dotenv
from utils import get_temp_path, ensure_temp_dir, log

# ============================================================
# ⚙️ CARGAR CONFIGURACIÓN
# ============================================================
load_dotenv(dotenv_path=r"C:\Proyectos\SistemaV2\config.env")

API_ID = int(os.getenv("TELEGRAM_API_ID", "0"))
API_HASH = os.getenv("TELEGRAM_API_HASH", "")
SESSION_NAME = os.getenv("TELEGRAM_SESSION", "SistemaBot")
BOT_USERNAME = os.getenv("BOT_USERNAME", "")

BASE_DIR = os.path.dirname(__file__)
SESSION_DIR = os.path.join(BASE_DIR, "sessions")

ensure_temp_dir()  # crea Data/temp_files si no existe
os.makedirs(SESSION_DIR, exist_ok=True)

client: TelegramClient | None = None

# ============================================================
# 🧩 VALIDAR VARIABLES .ENV
# ============================================================
def validar_env():
    faltantes = []
    for var in ["TELEGRAM_API_ID", "TELEGRAM_API_HASH", "TELEGRAM_SESSION", "BOT_USERNAME"]:
        if not os.getenv(var):
            faltantes.append(var)
    if faltantes:
        print("\n❌ ERROR: Faltan variables en config.env:")
        for f in faltantes:
            print(f"   -", f)
        print("🛑 Corrige el archivo antes de ejecutar nuevamente.\n")
        raise SystemExit(1)

validar_env()

# ============================================================
# 🧹 LIMPIEZA AUTOMÁTICA DE TEMPORALES
# ============================================================
def limpiar_temp_files():
    try:
        limite = datetime.datetime.now() - datetime.timedelta(days=1)
        base_temp = os.path.dirname(get_temp_path())
        for archivo in os.listdir(base_temp):
            ruta = os.path.join(base_temp, archivo)
            if os.path.isfile(ruta):
                mod_time = datetime.datetime.fromtimestamp(os.path.getmtime(ruta))
                if mod_time < limite:
                    os.remove(ruta)
                    log(f"🧹 Archivo viejo eliminado: {archivo}")
    except Exception as e:
        log(f"⚠️ Error limpiando temporales: {e}")

# ============================================================
# 🔌 CONECTAR O REUTILIZAR CLIENTE TELEGRAM
# ============================================================
async def conectar() -> TelegramClient:
    global client
    try:
        if client and client.is_connected():
            return client

        session_path = os.path.join(SESSION_DIR, SESSION_NAME)
        log("🔌 Conectando a Telegram...")

        client = TelegramClient(session_path, API_ID, API_HASH)
        await client.start()
        log("✅ Sesión iniciada correctamente.")
        return client

    except errors.AuthKeyError:
        log("⚠️ Sesión corrupta. Se regenerará.")
        try:
            os.remove(f"{session_path}.session")
        except FileNotFoundError:
            pass
        return await conectar()

    except Exception as e:
        log(f"❌ Error al conectar con Telegram: {e}")
        raise e

# ============================================================
# 🧠 ENVIAR COMANDO Y CAPTURAR RESPUESTA (robusto: solo mensajes nuevos)
# ============================================================
async def enviar_comando(comando: str) -> dict:
    limpiar_temp_files()
    ensure_temp_dir()

    try:
        # --- Validación de formato para /nm ---
        if comando.startswith("/nm"):
            partes = comando.split("|")
            if len(partes) != 3:
                return {
                    "status": "error",
                    "texto": "⚠️ Formato inválido. Usa: /nm nombre|apellidopaterno|apellidomaterno"
                }

        tg = await conectar()
        if not BOT_USERNAME:
            return {"status": "error", "texto": "BOT_USERNAME no configurado en config.env."}

        # --- Obtener el último id conocido antes de enviar (para ignorar históricos) ---
        try:
            last_msgs = await tg.get_messages(BOT_USERNAME, limit=1)
            last_id = last_msgs[0].id if last_msgs else 0
        except Exception:
            last_id = 0

        log(f"📤 Enviando comando: {comando}  (last_id previo: {last_id})")
        await tg.send_message(BOT_USERNAME, comando)

        # --- Parámetros de espera ---
        timeout = 90          # espera máxima en segundos (aumentada)
        intervalo = 5         # poll cada n segundos
        max_mensajes = 5      # tope razonable de mensajes a capturar
        log(f"⏱️ Esperando respuesta del bot (máx {timeout}s)...")

        mensajes_capturados = []
        seen_ids = set()
        tiempo_inicio = datetime.datetime.now()

        # --- Loop de espera: buscar solo mensajes con id > last_id ---
        while (datetime.datetime.now() - tiempo_inicio).total_seconds() < timeout:
            await asyncio.sleep(intervalo)
            try:
                recientes = await tg.get_messages(BOT_USERNAME, limit=20)
            except Exception as e:
                log(f"⚠️ Error obteniendo mensajes recientes: {e}")
                recientes = []

            for msg in recientes:
                # aceptamos sólo mensajes con id mayor al último conocido antes del envío
                if getattr(msg, "id", 0) and msg.id > last_id and msg.id not in seen_ids:
                    mensajes_capturados.append(msg)
                    seen_ids.add(msg.id)
                    log(f"📨 Nuevo mensaje posterior recibido (id={msg.id}) — total: {len(mensajes_capturados)}")

            # criterio para cortar antes de timeout
            if len(mensajes_capturados) >= max_mensajes:
                break

        if not mensajes_capturados:
            return {"status": "error", "texto": "⚠️ El bot no respondió dentro del tiempo esperado."}

        # --- Ordenar por id (cronológico) y procesar ---
        mensajes_capturados = sorted(mensajes_capturados, key=lambda m: m.id)
        archivos_guardados = []
        textos = []

        for idx, msg in enumerate(mensajes_capturados):
            if msg.text:
                textos.append(msg.text.strip())
            if msg.media:
                timestamp = int(datetime.datetime.now().timestamp())
                extension = msg.file.ext if getattr(msg, "file", None) and msg.file.ext else ".bin"
                nombre_archivo = f"respuesta_{timestamp}_{idx}{extension}"
                ruta_local = get_temp_path(nombre_archivo)
                try:
                    saved = await msg.download_media(ruta_local)
                    if saved:
                        archivos_guardados.append(nombre_archivo)
                        log(f"📎 Archivo recibido (nuevo): {saved}")
                except Exception as e:
                    log(f"❌ Error al guardar archivo ({nombre_archivo}): {e}")

        texto_final = "\n\n".join(textos).strip() if textos else comando
        respuesta_path = get_temp_path("respuestas.json")
        temp_path = respuesta_path + ".tmp"

        data = {
            "status": "ok",
            "texto": texto_final,
            "archivos": archivos_guardados,
            "archivo": archivos_guardados[0] if archivos_guardados else None,
            "tipo_respuesta": "archivo" if archivos_guardados else "texto",
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        os.replace(temp_path, respuesta_path)
        log(f"💾 Respuesta guardada en: {respuesta_path}")

        return data

    # ======================================================
    # 🧱 CONTROL DE ERRORES TELEGRAM
    # ======================================================
    except errors.FloodWaitError as e:
        log(f"⚠️ FloodWait: {e.seconds}s. Reintentando...")
        await asyncio.sleep(e.seconds)
        return await enviar_comando(comando)

    except errors.RPCError as e:
        log(f"❌ Error RPC: {e}")
        return {"status": "error", "texto": f"Error RPC: {str(e)}"}

    except Exception as e:
        log(f"❌ Error crítico: {e}")
        return {"status": "error", "texto": str(e)}