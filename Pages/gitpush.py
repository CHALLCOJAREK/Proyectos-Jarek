import subprocess
import datetime
import shutil
import os
import sys

# ==============================================
#  FÉNIX ENGINE v4.2 — GIT PUSH + BACKUP PREMIUM
# ==============================================

def banner(msg):
    print("\n" + "="*60)
    print(f"🔥  {msg}")
    print("="*60 + "\n")

def step(msg): print(f"📂  {msg}")
def ok(msg): print(f"   ✔️  {msg}")
def info(msg): print(f"ℹ️  {msg}")
def err(msg): print(f"❌  {msg}")

def run(cmd, allow_fail=False):
    """Ejecuta comandos y maneja errores elegantes."""
    result = subprocess.run(cmd, shell=True, text=True,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE)

    if result.returncode != 0 and not allow_fail:
        err(f"ERROR ejecutando: {cmd}")
        print(result.stdout)
        print(result.stderr)
        sys.exit(1)

    return result


if __name__ == "__main__":
    # Detectamos ruta base del proyecto (donde está este script)
    PROYECTO = os.path.dirname(os.path.abspath(__file__))
    BACKUP_BASE = r"C:\BACKUPS_JAREK\Backup-JarekPort"

    banner("GIT PUSH + BACKUP — Fénix Engine v4.2 ESTABLE")

    print(f"📌  Proyecto detectado en:\n     {PROYECTO}\n")
    os.chdir(PROYECTO)

    # ===========================
    # 1) ADD
    # ===========================
    step("Añadiendo archivos al stage…")
    run("git add .")
    ok("Archivos añadidos")

    # ===========================
    # 2) COMMIT
    # ===========================
    mensaje = f"Auto-commit {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    step("Creando commit…")

    commit = run(f'git commit -m "{mensaje}"', allow_fail=True)

    if "nothing to commit" in commit.stdout.lower():
        info("No hay cambios para commitear, continuando…")
    else:
        ok("Commit creado")

    # ===========================
    # 3) PUSH
    # ===========================
    step("Subiendo cambios al repositorio remoto…")
    push = run("git push", allow_fail=True)

    if "rejected" in push.stderr.lower():
        err("Push rechazado por el remoto. Revisa permisos o conflictos.")
        sys.exit(1)
    else:
        ok("Push completado")

    # ===========================
    # 4) BACKUP
    # ===========================
    step("Generando backup del proyecto…")

    fecha = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    carpeta_backup = os.path.join(BACKUP_BASE, f"Backup_{fecha}")

    try:
        shutil.copytree(PROYECTO, carpeta_backup)
        ok(f"Backup creado en:\n     {carpeta_backup}")
    except Exception as e:
        err("Error al crear backup:")
        print(e)
        sys.exit(1)

    print("\n🔥  Todo listo, Jarek. Tu repositorio y tu backup están al día.\n")
