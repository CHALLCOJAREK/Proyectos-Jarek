/* =========================================================
   NEO•TECH DNI TOOL — JS v1.0
   Carga de imágenes, previsualización y función de impresión
========================================================= */

/* ---------- UTILIDAD: CARGAR IMAGEN ----------- */
function loadImage(fileInputId, imgElementId) {
    const input = document.getElementById(fileInputId);
    const img = document.getElementById(imgElementId);

    input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

/* ---------- INICIALIZAR INPUTS ---------- */
loadImage("file1", "img1");
loadImage("file2", "img2");

/* ---------- BOTÓN DE IMPRESIÓN ---------- */
document.getElementById("printBtn").addEventListener("click", () => {
    // Validación simple antes de imprimir
    const img1 = document.getElementById("img1").src;
    const img2 = document.getElementById("img2").src;

    if (!img1 || !img2) {
        alert("Sube ambas fotos antes de imprimir.");
        return;
    }

    window.print();
});
