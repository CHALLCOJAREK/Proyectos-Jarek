from turtle import *
from math import *
import colorsys

speed(0)
bgcolor("black")
goto(0, -40)
hideturtle()

# Cantidad de hojas grandes
num_petals = 16
hue = 0
hue_step = 1 / num_petals
excluded_hues = [(0.78, 0.94)]  # Evitar rosado y morado

def valid_hue(h):
    for start, end in excluded_hues:
        if start <= h <= end:
            return False
    return True

# Dibujar pétalos con colores degradados
for i in range(num_petals):
    while not valid_hue(hue):
        hue = (hue + hue_step) % 1.0
    r, g, b = colorsys.hsv_to_rgb(hue, 1, 1)
    color(r, g, b)
    
    for j in range(18):
        rt(90)
        circle(150 - j * 6, 90)
        lt(90)
        circle(150 - j * 6, 90)
        rt(180)
    
    circle(40, 24)
    hue = (hue + hue_step) % 1.0

# Espiral del centro (girasol)
color('black')
shape('circle')
shapesize(0.5)
fillcolor("#E3EF0D")
golden_ang = 137.508
phi = golden_ang * (pi / 180)

for i in range(140):
    r = 4 * sqrt(i)
    theta = i * phi
    x = r * cos(theta)
    y = r * sin(theta)
    penup()
    goto(x, y)
    setheading(golden_ang)
    pendown()
    stamp()

# Punto naranja
def point(x, y):
    penup()
    goto(x, y)
    pendown()
    color('black')
    fillcolor("#FF5416")
    begin_fill()
    circle(4)
    end_fill()

# Letra T
def draw_T(x, y):
    positions_t = [(x, y+30), (x+6, y+30), (x+12, y+30), (x+18, y+30),
                   (x+24, y+30), (x+30, y+30), (x+12, y+24), (x+12, y+18),
                   (x+12, y+12), (x+12, y+6), (x+12, y)]
    for pos in positions_t:
        point(pos[0], pos[1])

# Letra U perfecta
def draw_U(x, y):
    # Lado izquierdo de la U (vertical)
    for i in range(0, 31, 6):
        point(x, y + i)

    # Parte inferior curva (en forma de semicírculo con puntos)
    bottom = [
        (x + 3, y - 3), (x + 6, y - 5), (x + 9, y - 6), (x + 12, y - 6),
        (x + 15, y - 5), (x + 18, y - 3)
    ]
    for pos in bottom:
        point(*pos)

    # Lado derecho de la U (vertical)
    for i in range(0, 31, 6):
        point(x + 24, y + i)


# Letras TU
draw_T(-27, -20)
draw_U(7, -20)

done()
