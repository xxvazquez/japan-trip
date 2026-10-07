import { describe, expect, it } from "vitest";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { mdToPlain, pdf } from "./dayPdf";

// a 1×1 white JPEG
const JPEG = Uint8Array.from(atob(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/yQALCAABAAEBAREA/8wABgAQEAX/2gAIAQEAAD8A0s8g/9k=",
), (c) => c.charCodeAt(0));

describe("pdf", () => {
  it("writes a PDF any reader opens, a page per image, with its links", async () => {
    const blob = pdf([
      { img: JPEG, px: [1, 1], links: [{ x: 10, y: 20, w: 100, h: 14, href: "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9 (main)" }] },
      { img: JPEG, px: [1, 1], links: [] },
    ]);
    const doc = await getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise;
    expect(doc.numPages).toBe(2);
    const [link] = await (await doc.getPage(1)).getAnnotations();
    expect(link.url).toBe("https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20(main)");
    // top-left origin in, bottom-left out: the link sits near the page's top
    expect(link.rect[3]).toBeCloseTo(841.89 - 20, 1);
  });
});

describe("mdToPlain", () => {
  it("keeps the words and bullets, drops the markup", () => {
    expect(mdToPlain("## Tickets\n- **Book** [online](https://x.y)\n- [ ] _queue_")).toBe("Tickets\n• Book online\n• queue");
  });
});
