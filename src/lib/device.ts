/** A phone or tablet: no hover and a finger for a pointer. Help copy reads
 *  for the device in hand — "touch and hold" here, "right-click" otherwise —
 *  the way iOS's own help only ever describes the device you're on. */
export const touchDevice =
  typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
