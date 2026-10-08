/**
 * A minimal `.zip` writer — enough to hand over a folder of files as one
 * download. Entries are *stored*, not compressed: what goes in is mostly PDFs
 * and photos, which are compressed already, so deflating them would cost time
 * on the phone for almost nothing. Opens in iPhone Files, Android's file
 * manager and every desktop unzip tool.
 *
 * No ZIP64, so the whole archive must stay under 4 GB — far above anything a
 * trip holds (each attachment is capped at 25 MB).
 */

export interface ZipEntry {
  /** path inside the archive, `/`-separated — e.g. `Trip/files/ticket.pdf` */
  path: string;
  data: Blob | string;
}

let table: Uint32Array | null = null;

export function crc32(bytes: Uint8Array): number {
  if (!table) {
    table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = table[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/** the date and time fields zip uses (local time, 2-second steps) */
function dosTime(d: Date): { time: number; date: number } {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
    date: ((Math.max(d.getFullYear(), 1980) - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

const UTF8_NAMES = 0x0800;

export async function buildZip(entries: ZipEntry[], when = new Date()): Promise<Blob> {
  const enc = new TextEncoder();
  const { time, date } = dosTime(when);
  const parts: BlobPart[] = [];
  const central: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;

  for (const e of entries) {
    const name = enc.encode(e.path);
    const bytes: Uint8Array<ArrayBuffer> = typeof e.data === "string" ? enc.encode(e.data) : new Uint8Array(await e.data.arrayBuffer());
    const crc = crc32(bytes);

    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true); // version needed
    lv.setUint16(6, UTF8_NAMES, true);
    lv.setUint16(8, 0, true); // stored
    lv.setUint16(10, time, true);
    lv.setUint16(12, date, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, bytes.length, true);
    lv.setUint32(22, bytes.length, true);
    lv.setUint16(26, name.length, true);
    lv.setUint16(28, 0, true);
    local.set(name, 30);
    parts.push(local, bytes);

    const dir = new Uint8Array(46 + name.length);
    const dv = new DataView(dir.buffer);
    dv.setUint32(0, 0x02014b50, true);
    dv.setUint16(4, 20, true); // made by
    dv.setUint16(6, 20, true); // version needed
    dv.setUint16(8, UTF8_NAMES, true);
    dv.setUint16(10, 0, true);
    dv.setUint16(12, time, true);
    dv.setUint16(14, date, true);
    dv.setUint32(16, crc, true);
    dv.setUint32(20, bytes.length, true);
    dv.setUint32(24, bytes.length, true);
    dv.setUint16(28, name.length, true);
    // extra, comment, disk, internal/external attributes all zero
    dv.setUint32(42, offset, true);
    dir.set(name, 46);
    central.push(dir);

    offset += local.length + bytes.length;
  }

  const dirSize = central.reduce((n, c) => n + c.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, dirSize, true);
  ev.setUint32(16, offset, true);

  return new Blob([...parts, ...central, end], { type: "application/zip" });
}

/** A file or folder name that's safe on iPhone, Android, Mac and Windows. */
export function safeName(s: string, fallback = "file"): string {
  const clean = s.replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-").replace(/\s+/g, " ").trim().replace(/^\.+/, "").slice(0, 100).trim();
  return clean || fallback;
}
