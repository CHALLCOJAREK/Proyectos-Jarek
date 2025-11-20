import cv2
import numpy as np
import turtle
img_path = "black-white-colouring-book-line-600nw-2548411593.webp"
img = cv2.imread(img_path)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, threshold1=50, threshold2=150)
contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
h, w = edges.shape
scale = 600 / max(w, h)
offset_x = -w * scale / 2
offset_y = h * scale / 2
screen = turtle.Screen()
screen.bgcolor("black")
screen.tracer(10)
t = turtle.Turtle()
t.hideturtle()
t.speed(0)
t.pencolor("white")
t.penup()
for contour in contours:
    if len(contour) < 2:
        continue
    x0, y0 = contour[0][0]
    t.penup()
    t.goto(x0 * scale + offset_x, offset_y - y0 * scale)
    t.pendown()
    for point in contour[1:]:
        x, y = point[0]
        t.goto(x * scale + offset_x, offset_y - y * scale)
    x_last, y_last = contour[-1][0]
    if np.linalg.norm(np.array([x_last, y_last]) - np.array([x0, y0])) < 5:
        t.goto(x0 * scale + offset_x, offset_y - y0 * scale)
turtle.done()