"""Regenerate all brand assets. Run:
    python3 scripts/make_icons.py

Two source files at the repo root, both full-bleed squares:
  - logo.png — OPAQUE, dark-teal background, no transparent margin, no baked
    rounding. Drives the static PWA icons + favicon: they need a solid
    background (iOS in particular forces a black one behind a transparent
    apple-touch-icon) and get their own rounding from the OS, not the art —
    there's only one, not a light/dark pair, because a manifest icon can't
    react to the OS theme anyway.
  - logo-mark.png — TRANSPARENT (the glyph only, no background at all).
    Drives the in-app themed marks (Wordmark, sign-in/offline/error screens),
    which already sit inside the app's own rounded, coloured container — a
    baked-in background there doubles up one rounded shape inside another.
Everything under public/icons, public/brand and public/favicon.png is derived
from these; edit the sources, re-run. logo-wordmark(.png|-light.png) are
reference art only (not consumed here — nothing in the app currently shows a
baked-in wordmark).
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..")
ICONS = os.path.join(ROOT, "public", "icons")
BRAND = os.path.join(ROOT, "public", "brand")
os.makedirs(ICONS, exist_ok=True)
os.makedirs(BRAND, exist_ok=True)

icon = Image.open(os.path.join(ROOT, "logo.png")).convert("RGB")
mark = Image.open(os.path.join(ROOT, "logo-mark.png")).convert("RGBA")


def resize(im, size):
    return im.resize((size, size), Image.LANCZOS)


# PWA icons — static (a manifest can't react to the OS theme); full-bleed, no
# padding.
resize(icon, 192).save(os.path.join(ICONS, "icon-192.png"))
resize(icon, 512).save(os.path.join(ICONS, "icon-512.png"))
resize(icon, 180).save(os.path.join(ICONS, "apple-touch-icon.png"))
resize(icon, 48).save(os.path.join(ROOT, "public", "favicon.png"))

# Maskable icon: the OS applies its own (often circular) mask, so keep the
# ring comfortably inside an ~80% safe zone instead of full-bleed.
canvas = Image.new("RGB", (512, 512), icon.getpixel((10, 10)))
inner = resize(icon, 410)
canvas.paste(inner, ((512 - 410) // 2, (512 - 410) // 2))
canvas.save(os.path.join(ICONS, "icon-maskable-512.png"))

# In-app marks: theme-reactive (see src/lib/mode.ts's useIsDark) — both
# filenames are kept for that switch, but currently share one transparent
# source (see the module docstring above), at the two sizes callers use
# (Wordmark ~128, full-screen states like SignIn/Offline/RouteError ~256).
for size in (128, 256):
    resize(mark, size).save(os.path.join(BRAND, f"logo-{size}-dark.png"))
    resize(mark, size).save(os.path.join(BRAND, f"logo-{size}-light.png"))

print("brand assets written from logo.png / logo-mark.png")
