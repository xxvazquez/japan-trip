import type { Doc } from "@/core/types";

/**
 * METADATA ONLY. Never put full passport numbers, scans or policy PDFs in here —
 * this file is in the repo. Actual documents are added on the device in the
 * Vault and stay in local storage only.
 */
export const docs: Doc[] = [
  {
    id: "doc-passport-1",
    title: "Passport — traveller 1",
    kind: "passport",
    fields: [
      { label: "Last 4", value: "····", sensitive: true },
      { label: "Expires", value: "—" },
      { label: "Issued by", value: "—" },
    ],
    note: "Add a photo of the ID page on the device only.",
  },
  {
    id: "doc-passport-2",
    title: "Passport — traveller 2",
    kind: "passport",
    fields: [
      { label: "Last 4", value: "····", sensitive: true },
      { label: "Expires", value: "—" },
      { label: "Issued by", value: "—" },
    ],
  },
  {
    id: "doc-insurance",
    title: "Travel insurance",
    kind: "insurance",
    fields: [
      { label: "Insurer", value: "—" },
      { label: "Policy no.", value: "—", sensitive: true },
      { label: "24h assistance", value: "—" },
      { label: "Covered until", value: "2026-11-14" },
    ],
  },
  {
    id: "doc-flight",
    title: "Flights",
    kind: "flight",
    fields: [
      { label: "Outbound", value: "Warsaw 20 Oct 13:30 → Beijing → Tokyo 21 Oct" },
      { label: "Return", value: "Tokyo 13 Nov 10:00 → Beijing → Warsaw 14 Nov" },
      { label: "Record locator", value: "—", sensitive: true },
      { label: "Airline app", value: "checked in?" },
    ],
  },
  {
    id: "doc-emergency",
    title: "Emergency contacts",
    kind: "contact",
    fields: [
      { label: "Police", value: "110" },
      { label: "Ambulance / Fire", value: "119" },
      { label: "Japan Visitor Hotline (24h, EN)", value: "050-3816-2787" },
      { label: "Embassy — Tokyo", value: "—" },
      { label: "Home contact", value: "—" },
    ],
  },
];
