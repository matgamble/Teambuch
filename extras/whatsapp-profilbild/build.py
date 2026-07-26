import pathlib
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

OUT_DIR = pathlib.Path("/home/user/Teambuch/extras/whatsapp-profilbild")
OUT_DIR.mkdir(exist_ok=True)

NAVY = (18, 38, 74)       # #12264a
CREAM = (243, 239, 230)   # #f3efe6
GOLD = (197, 139, 43)     # #c58b2b

SIZE = 1024

# simple, calm diagonal gradient: cream -> slightly warmer cream/gold tint
yy, xx = np.mgrid[0:SIZE, 0:SIZE]
t = (xx + yy) / (2 * SIZE)  # 0 top-left -> 1 bottom-right
t = np.clip(t, 0, 1)

cream = np.array(CREAM, dtype=np.float32)
warm = np.array((238, 224, 195), dtype=np.float32)  # soft warm cream, gold-tinted
grad = cream[None, None, :] * (1 - t[:, :, None] * 0.75) + warm[None, None, :] * (t[:, :, None] * 0.75)
canvas = Image.fromarray(np.clip(grad, 0, 255).astype(np.uint8), "RGB")

# orka silhouette, recolored to navy, centered
orka = Image.open("/home/user/Teambuch/site/orka-symbol.png").convert("RGBA")
alpha = orka.split()[-1]
navy_layer = Image.new("RGBA", orka.size, NAVY + (0,))
navy_layer.putalpha(alpha)

target_w = int(SIZE * 0.72)
scale = target_w / navy_layer.width
target_h = int(navy_layer.height * scale)
navy_big = navy_layer.resize((target_w, target_h), Image.LANCZOS)

paste_x = (SIZE - target_w) // 2
paste_y = int(SIZE * 0.5) - target_h // 2

# soft drop shadow for gentle depth
shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
shadow_layer = Image.new("RGBA", navy_big.size, NAVY + (90,))
shadow_layer.putalpha(navy_big.split()[-1].point(lambda a: int(a * 0.35)))
shadow.paste(shadow_layer, (paste_x + 8, paste_y + 12), shadow_layer)
shadow = shadow.filter(ImageFilter.GaussianBlur(10))

canvas_rgba = canvas.convert("RGBA")
canvas_rgba.alpha_composite(shadow)
canvas_rgba.alpha_composite(navy_big, (paste_x, paste_y))

# thin gold ring accent, inset from the edge (echoes the site's gold accent color)
ring = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
d = ImageDraw.Draw(ring)
inset = 26
d.ellipse([inset, inset, SIZE - inset, SIZE - inset], outline=GOLD + (200,), width=10)
canvas_rgba.alpha_composite(ring)

final = canvas_rgba.convert("RGB")
final.save(OUT_DIR / "profilbild-die-verrueckten.png")
print("saved", final.size)
