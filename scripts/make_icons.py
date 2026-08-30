"""Regenerate all brand assets from logo.png.  Run:  python3 scripts/make_icons.py

Source of truth: logo.png in the repo root (a transparent illustration).
Everything under public/icons, public/brand and public/favicon.png is derived
from it — edit the source, re-run.
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "logo.png")
ICONS = os.path.join(ROOT, "public", "icons")
BRAND = os.path.join(ROOT, "public", "brand")
os.makedirs(ICONS, exist_ok=True)
os.makedirs(BRAND, exist_ok=True)

BG = (242, 244, 246)  # soft mist, for masked / opaque contexts

logo = Image.open(SRC).convert("RGBA")


def fit(size, pad=0.12, bg=None):
    """Square `size` canvas, illustration scaled to `contain` with `pad` margin."""
    canvas = Image.new("RGBA", (size, size), (bg or (0, 0, 0, 0)))
    inner = round(size * (1 - 2 * pad))
    scale = inner / max(logo.width, logo.height)
    w, h = round(logo.width * scale), round(logo.height * scale)
    resized = logo.resize((w, h), Image.LANCZOS)
    canvas.paste(resized, ((size - w) // 2, (size - h) // 2), resized)
    return canvas


# PWA — opaque soft background (home-screen friendly, maskable-safe)
fit(192, pad=0.14, bg=BG).save(os.path.join(ICONS, "icon-192.png"))
fit(512, pad=0.14, bg=BG).save(os.path.join(ICONS, "icon-512.png"))
fit(512, pad=0.20, bg=BG).save(os.path.join(ICONS, "icon-maskable-512.png"))
fit(180, pad=0.12, bg=BG).save(os.path.join(ICONS, "apple-touch-icon.png"))

# favicon + in-app mark — transparent so it sits on any surface
fit(48, pad=0.06).save(os.path.join(ROOT, "public", "favicon.png"))
fit(128, pad=0.05).save(os.path.join(BRAND, "logo-128.png"))
fit(256, pad=0.05).save(os.path.join(BRAND, "logo-256.png"))

print("brand assets written from", os.path.abspath(SRC))
