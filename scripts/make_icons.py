"""Regenerate all brand assets from logo.png / logo-light.png.  Run:
    python3 scripts/make_icons.py

Source of truth: logo.png (dark) and logo-light.png (light) in the repo root —
both full-bleed square marks with no transparent margin. Everything under
public/icons, public/brand and public/favicon.png is derived from them; edit
the sources, re-run. logo-wordmark(.png|-light.png) are reference art only
(not consumed here — nothing in the app currently shows a baked-in wordmark).
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..")
ICONS = os.path.join(ROOT, "public", "icons")
BRAND = os.path.join(ROOT, "public", "brand")
os.makedirs(ICONS, exist_ok=True)
os.makedirs(BRAND, exist_ok=True)

dark = Image.open(os.path.join(ROOT, "logo.png")).convert("RGB")
light = Image.open(os.path.join(ROOT, "logo-light.png")).convert("RGB")


def resize(im, size):
    return im.resize((size, size), Image.LANCZOS)


# PWA icons — static (a manifest can't react to the OS theme), so the bolder
# dark mark is used throughout; full-bleed, no padding.
resize(dark, 192).save(os.path.join(ICONS, "icon-192.png"))
resize(dark, 512).save(os.path.join(ICONS, "icon-512.png"))
resize(dark, 180).save(os.path.join(ICONS, "apple-touch-icon.png"))
resize(dark, 48).save(os.path.join(ROOT, "public", "favicon.png"))

# Maskable icon: the OS applies its own (often circular) mask, so keep the
# ring comfortably inside an ~80% safe zone instead of full-bleed.
canvas = Image.new("RGB", (512, 512), dark.getpixel((10, 10)))
inner = resize(dark, 410)
canvas.paste(inner, ((512 - 410) // 2, (512 - 410) // 2))
canvas.save(os.path.join(ICONS, "icon-maskable-512.png"))

# In-app marks: theme-reactive (see src/lib/mode.ts's useIsDark), so both
# variants are kept, at the two sizes callers use (Wordmark ~128, full-screen
# states like SignIn/Offline/RouteError ~256).
for size in (128, 256):
    resize(dark, size).save(os.path.join(BRAND, f"logo-{size}-dark.png"))
    resize(light, size).save(os.path.join(BRAND, f"logo-{size}-light.png"))

print("brand assets written from logo.png / logo-light.png")
