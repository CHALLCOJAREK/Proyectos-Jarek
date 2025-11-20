// script.js
function actualizarFirma() {
  const nombre = document.getElementById('nombreInput').value;
  const cargo = document.getElementById('cargoInput').value;
  const telefono = document.getElementById('telefonoInput').value;
  const email = document.getElementById('emailInput').value;
  const web = document.getElementById('webInput').value;
  const linkedin = document.getElementById('linkedinInput').value;
  const fotoInput = document.getElementById('fotoInput').files[0];
  const logo = document.getElementById('logoInput').value;

  document.getElementById('nombre').textContent = nombre;
  document.getElementById('cargo').textContent = cargo;
  document.getElementById('telefono').textContent = telefono;
  document.getElementById('email').href = `mailto:${email}`;
  document.getElementById('email').textContent = email;
  document.getElementById('web').href = web;
  document.getElementById('web').textContent = web;
  document.getElementById('linkedin').href = `https://linkedin.com/in/${linkedin}`;
  document.getElementById('linkedin').textContent = linkedin;
  document.getElementById('logo').src = logo;

  if (fotoInput) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('foto').src = e.target.result;
    };
    reader.readAsDataURL(fotoInput);
  }
}

function descargarFirma() {
  html2canvas(document.getElementById('firmaContainer')).then(function(canvas) {
    const link = document.createElement('a');
    link.download = 'firma.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}
