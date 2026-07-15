"""
Desktop-Hintergrund im Teambuch-Design: Orka + Zirbelnuss, ausgeschnitten
aus site/teambuch-cover.png, mit gebogenem "Kita Reischlestraße"-Schriftzug
über der Illustration und dem Motto mittig unten.

Voraussetzungen (liegen alle in diesem Ordner):
  - crop_illustration.png  (Orka+Welle+Zirbelnuss, freigestellt aus dem Titelbild)
  - arctext.png            (gebogener Schriftzug "Kita Reischlestraße", transparent)
  - motto.png              (Icon-Zeile "Gemeinsam. Für Kinder. Mit Herz und Ideen.", transparent)

arctext.png und motto.png werden aus arctext.html / motto.html per Playwright
gerendert, falls sie neu erzeugt werden müssen (siehe Kommentare unten).

Feststehende Design-Entscheidungen (Stand: 15. Juli 2026, mit der Nutzerin
abgestimmt):
  - Hintergrund: einfarbig Grau #A3A39B (kein Verlauf, "grauer Hintergrund")
  - Kein "Teambuch"-Schriftzug, nur "Kita Reischlestraße" im Bogen
  - Illustration + Bogentext unten RECHTS positioniert (viel Platz links/oben
    für Desktop-Icons)
  - Motto-Zeile mittig unten
  - Illustration bewusst klein gehalten ("das Bild kleiner")

Aufruf: python3 build.py  -> erzeugt wallpaper-1920x1200.png und
wallpaper-3840x2160.png in diesem Ordner.
"""
import pathlib
from PIL import Image, ImageFilter, ImageDraw, ImageChops
import numpy as np

BASE = pathlib.Path(__file__).parent
BG = (163, 163, 155)  # grau
SOURCE_BG = (249, 244, 233)  # cremeweißer Hintergrund im Original-Ausschnitt


def build(W, H, illu_scale, right_margin, illu_y, motto_scale, motto_y, out_name):
    canvas = Image.new("RGB", (W, H), BG)

    illu = Image.open(BASE / "crop_illustration.png").convert("RGB")
    arr = np.array(illu).astype(np.int16)
    bgcol = np.array(SOURCE_BG)
    dist = np.sqrt(((arr - bgcol) ** 2).sum(axis=2))
    low, high = 10, 55
    alpha = np.clip((dist - low) / (high - low) * 255, 0, 255).astype(np.uint8)

    illu_rgba = illu.convert("RGBA")
    fw, fh = illu_rgba.size
    feather = 35
    edge_mask = Image.new("L", (fw, fh), 0)
    d = ImageDraw.Draw(edge_mask)
    d.rectangle([feather, feather, fw - feather, fh - feather], fill=255)
    edge_mask = edge_mask.filter(ImageFilter.GaussianBlur(feather / 2))
    combined_alpha = ImageChops.multiply(Image.fromarray(alpha, mode="L"), edge_mask)
    illu_rgba.putalpha(combined_alpha)

    new_w, new_h = int(fw * illu_scale), int(fh * illu_scale)
    illu_big = illu_rgba.resize((new_w, new_h), Image.LANCZOS)
    illu_x = W - new_w - right_margin
    canvas.paste(illu_big, (illu_x, illu_y), illu_big)

    arctext = Image.open(BASE / "arctext.png").convert("RGBA")
    at_scale = (new_w * 1.15) / arctext.width
    at_w, at_h = int(arctext.width * at_scale), int(arctext.height * at_scale)
    arctext_big = arctext.resize((at_w, at_h), Image.LANCZOS)
    at_x = illu_x + (new_w - at_w) // 2
    at_y = illu_y - at_h + int(70 * illu_scale / 1.3)
    canvas.paste(arctext_big, (at_x, at_y), arctext_big)

    motto = Image.open(BASE / "motto.png").convert("RGBA")
    m_w, m_h = int(motto.width * motto_scale), int(motto.height * motto_scale)
    motto_big = motto.resize((m_w, m_h), Image.LANCZOS)
    motto_x = (W - m_w) // 2
    canvas.paste(motto_big, (motto_x, motto_y), motto_big)

    canvas.save(BASE / out_name)
    print("saved", out_name, canvas.size)


# 3840x2160 (4K)
build(3840, 2160, illu_scale=0.95, right_margin=180, illu_y=980,
      motto_scale=1.1, motto_y=1910, out_name="wallpaper-3840x2160.png")

# 1920x1200
build(1920, 1200, illu_scale=0.50, right_margin=95, illu_y=630,
      motto_scale=0.62, motto_y=1055, out_name="wallpaper-1920x1200.png")
