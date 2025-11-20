import cv2
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
image_path = 'perfil.png'
img = cv2.imread(image_path)
if img is None:
    raise FileNotFoundError("No se pudo cargar la imagen. Verifica la ruta.")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
gray = cv2.GaussianBlur(gray, (5, 5), 0)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                              cv2.THRESH_BINARY_INV, 11, 2)
edges = cv2.Canny(thresh, 50, 150, apertureSize=3)
black_background = np.zeros_like(img)
contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
fig, ax = plt.subplots(figsize=(8, 8))
ax.set_facecolor('black')
ax.axis('off')
canvas = np.zeros_like(img)
img_plot = ax.imshow(canvas, cmap='gray')
def init():
    img_plot.set_data(canvas)
    return [img_plot]
def update(frame):
    if frame < len(contours):
        cv2.drawContours(canvas, contours, frame, (255, 255, 255), 1)
        img_plot.set_data(canvas)
    return [img_plot]
ani = FuncAnimation(fig, update, frames=len(contours) + 10, init_func=init, 
                    interval=20, blit=True)
plt.show()
output_path = 'imagen_picasso_lineas.jpg'
cv2.imwrite(output_path, canvas)