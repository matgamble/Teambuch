"""
WhatsApp-Profilbild fuer die Gruppe "Die Verrueckten" im Teambuch-Design:
Orka-Silhouette (aus site/orka-symbol.png, navy eingefaerbt) auf warmem
Verlaufshintergrund, mit gebogenem Schriftzug "Die Verrueckten" (Georgia
italic, wie das "Teambuch"-Wortlogo) und duennem Gold-Ring als Rahmen.

Voraussetzungen (liegen im selben Ordner):
  - arctext-die-verrueckten.png  (gebogener Schriftzug, transparent,
    gerendert aus arctext-die-verrueckten.html per Playwright)

Aufruf: python3 build.py  -> erzeugt profilbild-die-verrueckten.png
(1024x1024, WhatsApp schneidet das Bild beim Upload automatisch rund zu).
"""
import pathlib
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

BASE = pathlib.Path(__file__).parent
OUT_DIR = BASE

NAVY = (18, 38, 74)       # #12264a
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

# orka silhouette, recolored to navy
orka = Image.open(BASE.parent.parent / "site" / "orka-symbol.png").convert("RGBA")
alpha = orka.split()[-1]
navy_layer = Image.new("RGBA", orka.size, NAVY + (0,))
navy_layer.putalpha(alpha)

target_w = int(SIZE * 0.58)
scale = target_w / navy_layer.width
target_h = int(navy_layer.height * scale)
navy_big = navy_layer.resize((target_w, target_h), Image.LANCZOS)

paste_x = (SIZE - target_w) // 2 + int(SIZE * 0.02)
paste_y = int(SIZE * 0.60) - target_h // 2

# soft drop shadow
shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
shadow_layer = Image.new("RGBA", navy_big.size, NAVY + (90,))
shadow_layer.putalpha(navy_big.split()[-1].point(lambda a: int(a * 0.35)))
shadow.paste(shadow_layer, (paste_x + 8, paste_y + 12), shadow_layer)
shadow = shadow.filter(ImageFilter.GaussianBlur(10))
canvas.alpha_composite(shadow)
canvas.alpha_composite(navy_big, (paste_x, paste_y))

# arc lettering "Die Verrueckten", curved above the whale
arctext = Image.open(BASE / "arctext-die-verrueckten.png").convert("RGBA")
at_w = int(SIZE * 0.86)
at_scale = at_w / arctext.width
at_h = int(arctext.height * at_scale)
arctext_big = arctext.resize((at_w, at_h), Image.LANCZOS)
at_x = (SIZE - at_w) // 2
at_y = int(SIZE * 0.10)
canvas.alpha_composite(arctext_big, (at_x, at_y))

# thin gold ring accent, inset from the edge
ring = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
d = ImageDraw.Draw(ring)
inset = 26
d.ellipse([inset, inset, SIZE - inset, SIZE - inset], outline=GOLD + (200,), width=10)
canvas.alpha_composite(ring)

final = canvas.convert("RGB")
final.save(OUT_DIR / "profilbild-die-verrueckten.png")
print("saved", final.size)
