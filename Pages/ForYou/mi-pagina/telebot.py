import asyncio
import os
import sys
import time
import re
from datetime import datetime
from dotenv import load_dotenv

from telethon import TelegramClient
from telethon.errors import (
    SessionPasswordNeededError,
    PhoneNumberInvalidError,
    PhoneCodeInvalidError,
    FloodWaitError
)

from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors

from colorama import init, Fore, Style

init(autoreset=True)
load_dotenv()

API_ID = int(os.getenv("API_ID", "0"))
API_HASH = os.getenv("API_HASH", "")
SESSION_NAME = 'fenix_session'
BOT_USERNAME = '@FenixOf_bot'
DOWNLOAD_FOLDER = 'fenix_downloads'
REPORT_FOLDER = 'fenix_reports'
INITIAL_WAIT = 600
IDLE_TIMEOUT = 300

COMMAND_SECTIONS = {
    "RENIEC": [
        "/dni → Datos C4 y foto rostro",
        "/dnif → Datos C4, foto, firma y huellas",
        "/dnid → Datos C4 y foto (base datos)",
        "/dnifd → Datos C4, foto, firma, huellas (BD)",
        "/nm → Buscar dni por nombres",
        "/actan → Actas nacimiento",
        "/actam → Actas matrimonio",
        "/actad → Actas defunción",
    ],
    "SUNARP": [
        "/sunarp → Propiedades por dni",
        "/sunarpdf → Propiedades PDF",
        "/pla → Info vehículo por placa/dni",
        "/partida → Partida sunarp por número",
        "/tive → PDF tarjeta vehicular",
        "/biv → Boleta informativa PDF",
        "/tivep → PDF tarjeta vehicular",
    ],
    "DELITOS": [
        "/mpfn → Delitos por dni",
        "/mpfnv → Delitos por nombres",
        "/antpdf → Antecedentes PDF",
        "/rqpdf → Requisitorias PDF",
        "/denuncias → Denuncias PDF",
        "/ant → Antecedentes online",
        "/rq → Requisitorias online",
        "/antpenver → Ver antecedentes penales",
        "/antpolver → Ver antecedentes policiales",
        "/antjudver → Ver antecedentes judiciales",
        "/mpfnpdf → Delitos PDF por nombres",
        "/rqv → Requisitorias vehículo por placa",
        "/rqvpdf → Requisitorias vehículo PDF",
        "/detenciones → Detenciones por dni",
    ],
    "GENERADORES": [
        "/dnivir → DNI virtual",
        "/dnive → DNI electrónico",
        "/antpenal → Antecedentes penales PDF",
        "/antpol → Antecedentes policiales PDF",
        "/antjud → Antecedentes judiciales PDF",
        "/c4 → Ficha Reniec PDF",
        "/c4w → Ficha Reniec blanca PDF",
        "/c4t → Certificado inscripción PDF",
        "/seeker → Datos seeker PDF",
        "/licencia → Licencia conducir electrónica",
        "/agv → Árbol genealógico con imagen",
    ],
    "INTEL & UTILITIES": [
        "/tel → Líneas y titulares por dni/número",
        "/telp → Líneas en tiempo real",
        "/bitel → Titular número Bitel",
        "/claro → Titular número Claro",
        "/ag → Árbol genealógico por dni",
        "/hogar → Clasificación socioeconómica",
        "/fam → Personas con las que vive",
        "/tra → Historial de trabajos",
        "/sunedu → Títulos universitarios",
        "/afp → Búsqueda AFP",
        "/finan → Búsqueda financiera",
        "/sbs → Búsqueda SBS",
        "/co → Correos por dni",
        "/dir → Direcciones por dni",
        "/sunat → Consulta SUNAT dni/ruc",
        "/trabajadores → Trabajadores por ruc",
        "/sueldos → Sueldos por dni",
        "/donate → Donar coins",
        "/mtc → Info MTC por dni",
    ]
}


def banner():
    print(Fore.LIGHTGREEN_EX + Style.BRIGHT + r"""
███████╗███████╗███╗   ██╗██╗██╗  ██╗
██╔════╝██╔════╝████╗  ██║██║╚██╗██╔╝
█████╗  █████╗  ██╔██╗ ██║██║ ╚███╔╝ 
██╔══╝  ██╔══╝  ██║╚██╗██║██║ ██╔██╗ 
██║     ███████╗██║ ╚████║██║██╔╝ ██╗
╚═╝     ╚══════╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝
    """ + Fore.GREEN + " 💀 FENIX BLACKNET CLIENT 💀\n")
def mostrar_menu_interactivo():
    print(Fore.LIGHTGREEN_EX + "\n═══════════════ HACKER COMMAND MENU ═══════════════")
    print("  [1] RENIEC")
    print("  [2] SUNARP")
    print("  [3] DELITOS")
    print("  [4] GENERADORES")
    print("  [5] INTEL & UTILITIES")
    print("  [0] Exit")

    opcion = input(Fore.YELLOW + "\n💀 SELECT SECTION NUMBER: ").strip()

    secciones = {
        "1": "RENIEC",
        "2": "SUNARP",
        "3": "DELITOS",
        "4": "GENERADORES",
        "5": "INTEL & UTILITIES"
    }

    if opcion == "0":
        print(Fore.RED + "⚡ Exiting menu...\n")
        return

    if opcion in secciones:
        seccion_nombre = secciones[opcion]
        print(Fore.LIGHTCYAN_EX + f"\n⚔️  {seccion_nombre} COMMANDS:\n")
        for cmd in COMMAND_SECTIONS[seccion_nombre]:
            print(Fore.GREEN + f"  {cmd}")
    else:
        print(Fore.RED + "⚠️ Invalid selection. Returning to main session.\n")

def validar_numero_telefono(numero: str) -> bool:
    numero = numero.strip()
    return numero.startswith("+") and numero[1:].isdigit() and 5 <= len(numero[1:]) <= 15


def crear_carpeta(nombre):
    if not os.path.exists(nombre):
        os.makedirs(nombre)
        print(Fore.LIGHTBLACK_EX + f"💀 Created folder: {nombre}")


def limpiar_formato_markdown(texto):
    if not texto:
        return "(sin texto)"
    texto = re.sub(r'(\*\*|__|\*|_)', '', texto)
    return texto.strip()


async def pedir_autenticacion(client, phone):
    try:
        print(Fore.CYAN + "\n📨 INITIATING CODE REQUEST...")
        await client.send_code_request(phone)
        code = input(Fore.YELLOW + "🔑 ENTER CODE: ").strip()
        await client.sign_in(phone, code)
    except PhoneNumberInvalidError:
        print(Fore.RED + "❌ INVALID PHONE NUMBER. EXITING.")
        sys.exit(1)
    except PhoneCodeInvalidError:
        print(Fore.RED + "❌ INVALID CODE. EXITING.")
        sys.exit(1)
    except SessionPasswordNeededError:
        pwd = input(Fore.YELLOW + "🔒 2FA ENABLED. ENTER PASSWORD: ").strip()
        await client.sign_in(password=pwd)


async def descargar_media(client, message):
    crear_carpeta(DOWNLOAD_FOLDER)
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{DOWNLOAD_FOLDER}/media_{timestamp}"
        result = await client.download_media(message, file=filename)
        print(Fore.GREEN + f"✅ FILE SAVED: {result}")
        return result
    except Exception as e:
        print(Fore.RED + f"❌ ERROR DOWNLOADING FILE: {e}")
        return None
async def escuchar_respuestas(client, destino, ultima_id):
    print(Fore.LIGHTCYAN_EX + "\n🕶️  Listening for bot responses... Stand by.\n")
    inicio = time.time()
    ultima_actividad = time.time()
    textos_capturados = []
    imagenes_descargadas = []

    while True:
        activity = False
        async for msg in client.iter_messages(destino, limit=10):
            if msg.id <= ultima_id:
                continue
            ultima_id = msg.id
            activity = True
            ultima_actividad = time.time()

            contenido = f"{msg.sender_id}: {msg.text or '(no text)'}"
            print(Fore.GREEN + f"🖊️ {contenido}")
            textos_capturados.append(contenido)

            if msg.media:
                print(Fore.YELLOW + "🗂️  Media detected. Downloading...")
                img_path = await descargar_media(client, msg)
                if img_path:
                    imagenes_descargadas.append(img_path)

        if time.time() - inicio < INITIAL_WAIT:
            await asyncio.sleep(1)
        elif time.time() - ultima_actividad < IDLE_TIMEOUT:
            await asyncio.sleep(1)
        else:
            print(Fore.CYAN + "✅ Session capture complete.\n")
            break

    if textos_capturados or imagenes_descargadas:
        generar_pdf_hacker(textos_capturados, imagenes_descargadas)
    else:
        print(Fore.RED + "⚠️ No new bot responses captured.")

    return ultima_id


def generar_pdf_hacker(textos, imagenes):
    crear_carpeta(REPORT_FOLDER)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    pdf_path = os.path.join(REPORT_FOLDER, f"Blacknet_Report_{timestamp}.pdf")

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm
    )

    styles = getSampleStyleSheet()
    style_normal = ParagraphStyle(
        'NormalCustom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=10,
        leading=14,
        alignment=4,
    )

    style_title = ParagraphStyle(
        'TitleCustom',
        parent=styles['Title'],
        fontName='Courier-Bold',
        fontSize=22,
        textColor=colors.HexColor("#00FF00"),
        alignment=1,
        spaceAfter=20
    )

    elements = []
    elements.append(Paragraph("💀 FENIX BLACKNET REPORT 💀", style_title))
    elements.append(PageBreak())

    img_iter = iter(imagenes)
    for texto in textos:
        texto_limpio = limpiar_formato_markdown(texto)
        for parrafo in texto_limpio.split("\n"):
            if parrafo.strip():
                elements.append(Paragraph(parrafo.strip(), style_normal))
                elements.append(Spacer(1, 8))
        try:
            img_path = next(img_iter)
            pil_image = Image.open(img_path)
            width, height = pil_image.size
            max_width = 14 * cm
            max_height = 14 * cm
            if width > max_width or height > max_height:
                ratio = min(max_width/width, max_height/height)
                width *= ratio
                height *= ratio
            elements.append(Spacer(1, 12))
            elements.append(RLImage(img_path, width=width, height=height))
            elements.append(Spacer(1, 20))
        except StopIteration:
            pass

        elements.append(Spacer(1, 20))

    def on_page(canvas, doc):
        canvas.saveState()
        footer = f"Page {doc.page} — BLACKNET REPORT"
        canvas.setFont('Courier', 8)
        canvas.setFillColor(colors.grey)
        canvas.drawCentredString(A4[0]/2, 1.5*cm, footer)
        canvas.restoreState()

    doc.build(elements, onFirstPage=on_page, onLaterPages=on_page)
    print(Fore.GREEN + f"✅ Report generated: {pdf_path}\n")


async def bucle_chat(client):
    print(Fore.LIGHTCYAN_EX + f"\n🌟 Type your messages to {BOT_USERNAME}. Use /exit or /menu anytime.\n")
    last_msg_id = 0

    async for msg in client.iter_messages(BOT_USERNAME, limit=1):
        last_msg_id = msg.id

    while True:
        texto = input(Fore.CYAN + "🗡️  YOU > ").strip()
        if texto.lower() in ('/exit', '/salir'):
            print(Fore.RED + "\n👋 Exiting session. Stay in the shadows.\n")
            break
        elif texto.lower() in ('/menu', '/help'):
            mostrar_menu_interactivo()
            continue
        if texto == '':
            continue
        try:
            await client.send_message(BOT_USERNAME, texto)
            print(Fore.GREEN + f"✅ Payload sent: {texto}")
            last_msg_id = await escuchar_respuestas(client, BOT_USERNAME, last_msg_id)
        except FloodWaitError as e:
            print(Fore.RED + f"⚠️ Flood wait! Wait {e.seconds} seconds.")
        except Exception as e:
            print(Fore.RED + f"❌ Error: {e}")


async def main():
    banner()

    if API_ID == 0 or not API_HASH:
        print(Fore.RED + "❌ Missing API_ID or API_HASH. Check your .env!")
        sys.exit(1)

    phone = input(Fore.YELLOW + "📱 Enter your phone (+countrycode...): ").strip()
    if not validar_numero_telefono(phone):
        print(Fore.RED + "❌ Invalid format. Example: +51987654321")
        sys.exit(1)

    client = TelegramClient(SESSION_NAME, API_ID, API_HASH)
    try:
        await client.connect()
        if not await client.is_user_authorized():
            await pedir_autenticacion(client, phone)

        me = await client.get_me()
        print(Fore.GREEN + f"✅ Session active as: {me.first_name} ({me.username})")
        await bucle_chat(client)

    except FloodWaitError as e:
        print(Fore.RED + f"⚠️ Flood wait: {e.seconds} seconds.")
    except Exception as e:
        print(Fore.RED + f"❌ Unexpected error: {e}")
    finally:
        await client.disconnect()
        print(Fore.LIGHTBLACK_EX + "\n🔒 Session closed.")


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(Fore.RED + "\n⏹ Interrupted by user.")
