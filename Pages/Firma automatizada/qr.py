import qrcode

# Crear el objeto QRCode
qr = qrcode.QRCode(
    version=1,  # Tamaño del QR (1 es el más pequeño)
    error_correction=qrcode.constants.ERROR_CORRECT_L,  # Nivel de corrección de errores
    box_size=10,  # Tamaño de cada cuadro del QR
    border=4,  # Ancho del borde
)

# Agregar datos al QR
data = "https://ibit.pe"  # Aquí pones la URL o texto que desees
qr.add_data(data)
qr.make(fit=True)

# Crear la imagen del código QR
img = qr.make_image(fill="black", back_color="white")

# Guardar la imagen del QR
img.save("codigo_qr.png")

print("Código QR generado exitosamente como 'codigo_qr.png'.")
