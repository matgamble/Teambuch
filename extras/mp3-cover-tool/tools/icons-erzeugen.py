from PIL import Image, ImageDraw
import os, sys

SRC = sys.argv[1]
RES = sys.argv[2]
BG = (38, 34, 29)  # #26221d - Graphit, wie im PWA-Manifest

src = Image.open(SRC).convert("RGB")

# Launcher-Icon (legacy, quadratisch) + runde Variante + adaptives Foreground
DENS = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}

for dens, size in DENS.items():
    d = os.path.join(RES, "mipmap-" + dens)
    os.makedirs(d, exist_ok=True)

    square = src.resize((size, size), Image.LANCZOS)
    square.save(os.path.join(d, "ic_launcher.png"))

    # runde Variante: gleicher Inhalt, kreisförmig maskiert (4x supersampled)
    big = src.resize((size * 4, size * 4), Image.LANCZOS).convert("RGBA")
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    big.putalpha(mask)
    big.resize((size, size), Image.LANCZOS).save(os.path.join(d, "ic_launcher_round.png"))

    # Adaptives Icon: Canvas ist 108dp, davon sind nur die inneren 72dp garantiert
    # sichtbar. Motiv deshalb auf ca. 62 % skaliert und transparent zentriert.
    fg_size = int(round(size * 108 / 48))
    art = int(round(fg_size * 0.62))
    fg = Image.new("RGBA", (fg_size, fg_size), (0, 0, 0, 0))
    art_img = src.resize((art, art), Image.LANCZOS).convert("RGBA")
    # dunkler Hintergrund des Motivs wird transparent, damit nur Plattenteller bleibt
    px = art_img.load()
    for y in range(art):
        for x in range(art):
            r, g, b, a = px[x, y]
            if abs(r - BG[0]) < 14 and abs(g - BG[1]) < 14 and abs(b - BG[2]) < 14:
                px[x, y] = (r, g, b, 0)
    off = (fg_size - art) // 2
    fg.paste(art_img, (off, off), art_img)
    fg.save(os.path.join(d, "ic_launcher_foreground.png"))

# Splash: einfarbiger Hintergrund mit zentriertem Motiv, in allen Varianten,
# die Capacitor anlegt (drawable + drawable-port-* / drawable-land-*).
SPLASH = {
    "drawable": (480, 320),
    "drawable-port-mdpi": (320, 480), "drawable-port-hdpi": (480, 800),
    "drawable-port-xhdpi": (720, 1280), "drawable-port-xxhdpi": (960, 1600),
    "drawable-port-xxxhdpi": (1280, 1920),
    "drawable-land-mdpi": (480, 320), "drawable-land-hdpi": (800, 480),
    "drawable-land-xhdpi": (1280, 720), "drawable-land-xxhdpi": (1600, 960),
    "drawable-land-xxxhdpi": (1920, 1280),
}
for d, (w, h) in SPLASH.items():
    path = os.path.join(RES, d)
    if not os.path.isdir(path):
        continue
    canvas = Image.new("RGB", (w, h), BG)
    s = int(min(w, h) * 0.34)
    canvas.paste(src.resize((s, s), Image.LANCZOS), ((w - s) // 2, (h - s) // 2))
    canvas.save(os.path.join(path, "splash.png"))

print("Icons und Splash-Screens erzeugt.")
