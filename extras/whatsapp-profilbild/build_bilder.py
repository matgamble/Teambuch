"""
WhatsApp-Community-Icon fuer "Bilder" im Teambuch-Design: ein Orka-Symbol
(aus site/orka-symbol.png, Original schwarz-weiss) auf warmem Verlaufs-
hintergrund, mit gebogenem Schriftzug "Bilder" (Georgia italic, wie das
"Teambuch"-Wortlogo), "Kita Reischlestraße" unten und duennem Gold-Ring
als Rahmen. Gleiches Layout wie build.py ("Die Verrueckten").

Aufruf: python3 build_bilder.py -> erzeugt icon-bilder.png
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

# orka-symbol.png ist bereits schwarz-weiss, unveraendert uebernehmen
orka_layer = Image.open(BASE.parent.parent / "site" / "orka-symbol.png").convert("RGBA")

target_w = int(SIZE * 0.50)
scale = target_w / orka_layer.width
target_h = int(orka_layer.height * scale)
orka_big = orka_layer.resize((target_w, target_h), Image.LANCZOS)

paste_x = (SIZE - target_w) // 2 + int(SIZE * 0.02)
paste_y = int(SIZE * 0.52) - target_h // 2

# soft drop shadow
shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
shadow_layer = Image.new("RGBA", orka_big.size, BLACK + (90,))
shadow_layer.putalpha(orka_big.split()[-1].point(lambda a: int(a * 0.35)))
shadow.paste(shadow_layer, (paste_x + 8, paste_y + 12), shadow_layer)
shadow = shadow.filter(ImageFilter.GaussianBlur(10))
canvas.alpha_composite(shadow)
canvas.alpha_composite(orka_big, (paste_x, paste_y))

# arc lettering "Bilder", curved above the whale
arctext = Image.open(BASE / "arctext-bilder.png").convert("RGBA")
at_w = int(SIZE * 0.62)
at_scale = at_w / arctext.width
at_h = int(arctext.height * at_scale)
arctext_big = arctext.resize((at_w, at_h), Image.LANCZOS)
at_x = (SIZE - at_w) // 2
at_y = int(SIZE * 0.15)
canvas.alpha_composite(arctext_big, (at_x, at_y))

# arc lettering "Kita Reischlestraße", curved below the whale (ohne Stadt-Logo)
arctext2 = Image.open(BASE / "arctext-kita-reischlestrasse.png").convert("RGBA")
at2_w = int(SIZE * 0.66)
at2_scale = at2_w / arctext2.width
at2_h = int(arctext2.height * at2_scale)
arctext2_big = arctext2.resize((at2_w, at2_h), Image.LANCZOS)
at2_x = (SIZE - at2_w) // 2
at2_y = int(SIZE * 0.775)
canvas.alpha_composite(arctext2_big, (at2_x, at2_y))

# thin gold ring accent, inset from the edge
ring = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
d = ImageDraw.Draw(ring)
inset = 26
d.ellipse([inset, inset, SIZE - inset, SIZE - inset], outline=GOLD + (200,), width=10)
canvas.alpha_composite(ring)

final = canvas.convert("RGB")
final.save(OUT_DIR / "icon-bilder.png")
print("saved", final.size)
