"""Regenerate all brand assets. Run:
    python3 scripts/make_icons.py

Two source files at the repo root, both full-bleed squares:
  - logo.png — OPAQUE, dark-teal background (its own rounded-card shape baked
    in). Drives only the two icon outputs that actually need a solid
    background: apple-touch-icon (iOS forces an ugly black one behind a
    transparent touch icon) and the maskable icon (the OS crops it to a
    shape but doesn't add its own backing, so a transparent one would show
    holes — that's what "maskable" means in the manifest spec).
  - logo-mark.png — TRANSPARENT (the glyph only, no background at all).
    Drives everything that can safely be transparent: the favicon, the
    "any"-purpose PWA icons (icon-192/512 — a browser tab or a Home Screen
    just shows the page/launcher behind them), and the in-app themed marks
    (Wordmark, sign-in/offline/error screens), which already sit inside the
    app's own rounded, coloured container — a baked-in background there
    doubles up one rounded shape inside another.
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


# Needs a solid background: iOS forces one behind apple-touch-icon anyway, and
# a maskable icon is defined to fill its own safe zone (no OS-added backing).
resize(icon, 180).save(os.path.join(ICONS, "apple-touch-icon.png"))
canvas = Image.new("RGB", (512, 512), icon.getpixel((10, 10)))
inner = resize(icon, 410)
canvas.paste(inner, ((512 - 410) // 2, (512 - 410) // 2))
canvas.save(os.path.join(ICONS, "icon-maskable-512.png"))

# Safe to leave transparent: a browser tab / "any"-purpose launcher icon just
# shows whatever's behind it.
resize(mark, 48).save(os.path.join(ROOT, "public", "favicon.png"))
resize(mark, 192).save(os.path.join(ICONS, "icon-192.png"))
resize(mark, 512).save(os.path.join(ICONS, "icon-512.png"))

# In-app marks: theme-reactive (see src/lib/mode.ts's useIsDark) — both
# filenames are kept for that switch, but currently share one transparent
# source (see the module docstring above), at the two sizes callers use
# (Wordmark ~128, full-screen states like SignIn/Offline/RouteError ~256).
for size in (128, 256):
    resize(mark, size).save(os.path.join(BRAND, f"logo-{size}-dark.png"))
    resize(mark, size).save(os.path.join(BRAND, f"logo-{size}-light.png"))

print("brand assets written from logo.png / logo-mark.png")
