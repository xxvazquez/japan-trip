"""Regenerate all brand assets from logo.png.  Run:  python3 scripts/make_icons.py

Source of truth is logo.png in the repo root. Everything under public/icons,
public/brand and public/favicon.png is derived from it — edit the source, re-run.
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "logo.png")
ICONS = os.path.join(ROOT, "public", "icons")
BRAND = os.path.join(ROOT, "public", "brand")
os.makedirs(ICONS, exist_ok=True)
os.makedirs(BRAND, exist_ok=True)

BG = (18, 21, 26)  # indigo-charcoal, for masked / opaque contexts

logo = Image.open(SRC).convert("RGBA")


def fit(size, pad=0.0, bg=None):
    """Square canvas `size`, logo centred at (1 - 2*pad) scale."""
    canvas = Image.new("RGBA", (size, size), (bg or (0, 0, 0, 0)))
    inner = round(size * (1 - 2 * pad))
    scaled = logo.resize((inner, inner), Image.LANCZOS)
    off = (size - inner) // 2
    canvas.paste(scaled, (off, off), scaled)
    return canvas


# transparent, edge-to-edge (logo already has its own padding + rounded shape)
fit(192).save(os.path.join(ICONS, "icon-192.png"))
fit(512).save(os.path.join(ICONS, "icon-512.png"))
# maskable + apple: opaque background, logo inside the safe zone
fit(512, pad=0.10, bg=BG).save(os.path.join(ICONS, "icon-maskable-512.png"))
fit(180, pad=0.06, bg=BG).save(os.path.join(ICONS, "apple-touch-icon.png"))
# favicon
fit(48).save(os.path.join(ROOT, "public", "favicon.png"))
# in-app mark
fit(128).save(os.path.join(BRAND, "logo-128.png"))
fit(256).save(os.path.join(BRAND, "logo-256.png"))

print("brand assets written from", os.path.abspath(SRC))
