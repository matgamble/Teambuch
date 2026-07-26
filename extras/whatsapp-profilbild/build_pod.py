"""
WhatsApp-Community-Icon fuer "Pod" im Teambuch-Design: mehrere Orka-
Symbole (aus site/orka-symbol.png, Original schwarz-weiss) in
verschiedenen Groessen/Positionen wie ein schwimmender Orka-Pod, auf
warmem Verlaufshintergrund, mit gebogenem Schriftzug "Pod" (Georgia
italic, wie das "Teambuch"-Wortlogo), "Kita Reischlestraße" unten und
duennem Gold-Ring als Rahmen.

Aufruf: python3 build_pod.py -> erzeugt icon-pod.png
(1024x1024, WhatsApp schneidet das Bild beim Upload automatisch rund zu).
"""
import pathlib
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

BASE = pathlib.Path(__file__).parent
OUT_DIR = BASE

NAVY = (18, 38, 74)       # #12264a, nur fuer den Schriftzug
BLACK = (0, 0, 0)         # Original-Farbe des Orka-Symbols im Teambuch
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

orka_src = Image.open(BASE.parent.parent / "site" / "orka-symbol.png").convert("RGBA")


def paste_with_shadow(base, orka_img, x, y, opacity=1.0):
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shadow_layer = Image.new("RGBA", orka_img.size, NAVY + (80,))
    shadow_layer.putalpha(orka_img.split()[-1].point(lambda a: int(a * 0.28)))
    shadow.paste(shadow_layer, (x + 6, y + 10), shadow_layer)
    shadow = shadow.filter(ImageFilter.GaussianBlur(9))
    base.alpha_composite(shadow)
    if opacity < 1.0:
        orka_img = orka_img.copy()
        orka_img.putalpha(orka_img.split()[-1].point(lambda a: int(a * opacity)))
    base.alpha_composite(orka_img, (x, y))


# Pod aus 4 Orkas, unterschiedliche Groessen/Positionen, alle in die
# gleiche Richtung schwimmend, von hinten (klein) nach vorne (gross)
# sortiert, damit die Reihenfolge beim Compositing stimmt. Tiefe wirkt
# ueber die Groesse, nicht ueber starke Transparenz (sonst wirkt es grau).
# (rel_w, center_x_frac, center_y_frac, opacity)
pod = [
    (0.20, 0.23, 0.635, 0.95),
    (0.24, 0.80, 0.63, 0.95),
    (0.30, 0.71, 0.50, 1.0),
    (0.46, 0.42, 0.565, 1.0),
]

for rel_w, cx_frac, cy_frac, opacity in pod:
    w = int(SIZE * rel_w)
    scale = w / orka_src.width
    h = int(orka_src.height * scale)
    img = orka_src.resize((w, h), Image.LANCZOS)
    x = int(SIZE * cx_frac) - w // 2
    y = int(SIZE * cy_frac) - h // 2
    paste_with_shadow(canvas, img, x, y, opacity=opacity)

# arc lettering "Pod", curved above the pod
arctext = Image.open(BASE / "arctext-pod.png").convert("RGBA")
at_w = int(SIZE * 0.46)
at_scale = at_w / arctext.width
at_h = int(arctext.height * at_scale)
arctext_big = arctext.resize((at_w, at_h), Image.LANCZOS)
at_x = (SIZE - at_w) // 2
at_y = int(SIZE * 0.115)
canvas.alpha_composite(arctext_big, (at_x, at_y))

# arc lettering "Kita Reischlestraße", curved below the pod
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
final.save(OUT_DIR / "icon-pod.png")
print("saved", final.size)
