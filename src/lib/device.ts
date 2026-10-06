/** A phone or tablet: no hover and a finger for a pointer. Help copy reads
 *  for the device in hand — "touch and hold" here, "right-click" otherwise —
 *  the way iOS's own help only ever describes the device you're on. */
export const touchDevice =
  typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;

/** "Tap" on a touch screen, "Click" with a mouse — for "Tap again to delete". */
export const TAP = touchDevice ? "Tap" : "Click";

/** iPhone / iPad — every browser there is WebKit. (iPadOS reports itself as
 *  a Mac, hence the touch check.) */
export const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

/** Hand a file the app made to the person. On the iPhone that's the Share
 *  sheet (Save to Files, AirDrop…): a plain download in a home-screen app
 *  opens a preview with no way back to the app. Elsewhere it downloads. */
export function saveFile(blob: Blob, filename: string): void {
  const file = new File([blob], filename, { type: blob.type });
  if (isIOS() && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file] }).catch((e: unknown) => {
      // closed the sheet: nothing to do. Refused (no tap to tie it to): download instead
      if ((e as Error)?.name !== "AbortError") download(blob, filename);
    });
    return;
  }
  download(blob, filename);
}

/** A plain browser download — also right on the iPhone for a calendar file,
 *  which WebKit hands straight to Calendar's own Add sheet. */
export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
