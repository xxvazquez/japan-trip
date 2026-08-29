import type { MediaItem } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 9);

/**
 * Read an image File, downscale it to fit `maxEdge`, and return a MediaItem with
 * a compact data URL. Keeps trip data small enough to live in one blob and work
 * offline.
 */
export async function fileToMediaItem(file: File, maxEdge = 1600, quality = 0.82): Promise<MediaItem> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const type = "image/webp";
  let dataUrl = canvas.toDataURL(type, quality);
  if (!dataUrl.startsWith("data:image/webp")) dataUrl = canvas.toDataURL("image/jpeg", quality);

  return { id: `media-${rid()}`, name: file.name.replace(/\.[^.]+$/, ""), dataUrl, w, h };
}

export function pickImage(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
}
