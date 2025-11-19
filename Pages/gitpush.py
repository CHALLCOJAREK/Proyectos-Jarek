import subprocess
import datetime
import shutil
import os

def run(cmd):
    result = subprocess.run(cmd, shell=True, text=True)
    if result.returncode != 0:
        print(f"❌ Error ejecutando: {cmd}")
        exit(1)

if __name__ == "__main__":
    # Mensaje automático
    mensaje = f"Auto-commit {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

    # Rutas
    ruta_original = r"C:\Jarek\Proyectos-Jarek"
    ruta_backup_base = r"C:\BACKUPS_JAREK"
    fecha = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    ruta_backup_final = os.path.join(ruta_backup_base, f"Backup_{fecha}")

    print("📁 Añadiendo archivos al stage…")
    run("git add .")

    print("📝 Creando commit automático…")
    run(f'git commit -m "{mensaje}"')

    print("🚀 Subiendo cambios al repositorio remoto…")
    run("git push")

    print("🗂️ Iniciando proceso de backup…")

    # Crear carpeta base si no existe
    os.makedirs(ruta_backup_base, exist_ok=True)

    # Copiar el proyecto completo
    try:
        shutil.copytree(ruta_original, ruta_backup_final)
        print(f"✅ Backup generado con éxito en: {ruta_backup_final}")
    except Exception as e:
        print(f"❌ Error durante el backup: {e}")
        exit(1)

    print("\n🔥 Push + Backup completados. Todo en verde, máquina.")
