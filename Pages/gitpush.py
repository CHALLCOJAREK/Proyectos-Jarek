import subprocess
import datetime

def run(cmd):
    result = subprocess.run(cmd, shell=True, text=True)
    if result.returncode != 0:
        print(f"Error ejecutando: {cmd}")
        exit(1)

if __name__ == "__main__":
    mensaje = f"Auto-commit {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    
    print(">>> Añadiendo archivos...")
    run("git add .")

    print(">>> Creando commit...")
    run(f'git commit -m "{mensaje}"')

    print(">>> Subiendo cambios al repo...")
    run("git push")

    print("\n🔥 Push completado. Tu repo está al día, capo.")
