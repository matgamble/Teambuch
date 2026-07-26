"""
WhatsApp-Community-Icon fuer "Vertretung" im Teambuch-Design: zwei
Orka-Symbole (aus site/orka-symbol.png, Original schwarz-weiss, ein
Orka gespiegelt, sodass sich beide zugewandt sind -- symbolisiert
gegenseitiges Einspringen/Vertreten) auf warmem Verlaufshintergrund,
mit gebogenem Schriftzug "Vertretung" (Georgia italic, wie das
"Teambuch"-Wortlogo), "Kita Reischlestraße" unten und duennem Gold-Ring
als Rahmen.

Aufruf: python3 build_vertretung.py -> erzeugt icon-vertretung.png
(1024x1024, WhatsApp schneidet das Bild beim Upload automatisch rund zu).
"""
import pathlib
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import numpy as np

BASE = pathlib.Path(__file__).parent
OUT_DIR = BASE

NAVY = (18, 38, 74)       # #12264a, nur fuer den Schriftzug
CREAM = (243, 239, 230)   # #f3efe6
GOLD = (197, 139, 43)     # #c58b2b

SIZE = 1024

# calm diagonal gradient: cream -> warm gold-tinted cream
yy, xx = np.mgrid[0:SIZE, 0:SIZE]
t = np.clip((xx + yy) / (2 * SIZE), 0, 1)
cream = np.array(CREAM, dtype=np.float32)
warm = np.array((238, 224, 195), dtype=np.float32)
grad = cream[None, None, :] * (1 - t[:, :, None] * 0.75) + warm[None, None, :] * (t[:, :, None] * 0.75)
canvas = Image.fromarray(np.clip(grad, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

# orka-symbol.png: original schwarz-weiss, unveraendert uebernehmen.
# Beide Orkas schwimmen in die gleiche Richtung (Paar/Team), der hintere
# kleiner und leicht versetzt -- symbolisiert gegenseitiges Einspringen.
orka_src = Image.open(BASE.parent.parent / "site" / "orka-symbol.png").convert("RGBA")

back_w = int(SIZE * 0.40)
back_scale = back_w / orka_src.width
back_h = int(orka_src.height * back_scale)
orka_back = orka_src.resize((back_w, back_h), Image.LANCZOS)

front_w = int(SIZE * 0.50)
front_scale = front_w / orka_src.width
front_h = int(orka_src.height * front_scale)
orka_front = orka_src.resize((front_w, front_h), Image.LANCZOS)

center_y = int(SIZE * 0.565)
back_x = int(SIZE * 0.50) - back_w // 2
back_y = center_y - back_h // 2 - int(SIZE * 0.11)
front_x = int(SIZE * 0.48) - front_w // 2
front_y = center_y - front_h // 2 + int(SIZE * 0.06)

def paste_with_shadow(base, orka_img, x, y, opacity=1.0):
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shadow_layer = Image.new("RGBA", orka_img.size, NAVY + (80,))
    shadow_layer.putalpha(orka_img.split()[-1].point(lambda a: int(a * 0.3)))
    shadow.paste(shadow_layer, (x + 8, y + 12), shadow_layer)
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    base.alpha_composite(shadow)
    if opacity < 1.0:
        orka_img = orka_img.copy()
        orka_img.putalpha(orka_img.split()[-1].point(lambda a: int(a * opacity)))
    base.alpha_composite(orka_img, (x, y))

# der hintere (kleinere) Orka zuerst, leicht transparent fuer Tiefe, dann der vordere
paste_with_shadow(canvas, orka_back, back_x, back_y, opacity=0.88)
paste_with_shadow(canvas, orka_front, front_x, front_y)

# arc lettering "Vertretung", curved above the whales
arctext = Image.open(BASE / "arctext-vertretung.png").convert("RGBA")
at_w = int(SIZE * 0.80)
at_scale = at_w / arctext.width
at_h = int(arctext.height * at_scale)
arctext_big = arctext.resize((at_w, at_h), Image.LANCZOS)
at_x = (SIZE - at_w) // 2
at_y = int(SIZE * 0.10)
canvas.alpha_composite(arctext_big, (at_x, at_y))

# arc lettering "Kita Reischlestraße", curved below the whales
arctext2 = Image.open(BASE / "arctext-kita-reischlestrasse.png").convert("RGBA")
at2_w = int(SIZE * 0.66)
at2_scale = at2_w / arctext2.width
at2_h = int(arctext2.height * at2_scale)
arctext2_big = arctext2.resize((at2_w, at2_h), Image.LANCZOS)
at2_x = (SIZE - at2_w) // 2
at2_y = int(SIZE * 0.79)
canvas.alpha_composite(arctext2_big, (at2_x, at2_y))

# thin gold ring accent, inset from the edge
ring = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
d = ImageDraw.Draw(ring)
inset = 26
d.ellipse([inset, inset, SIZE - inset, SIZE - inset], outline=GOLD + (200,), width=10)
canvas.alpha_composite(ring)

final = canvas.convert("RGB")
final.save(OUT_DIR / "icon-vertretung.png")
print("saved", final.size)
