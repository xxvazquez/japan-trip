import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { IconTile } from "./IconTile";
import type { HelpPreview as PreviewId } from "@/lib/help";

/**
 * The picture at the top of a Help answer — a small, still copy of the real
 * screen with the part that matters ringed, the way Apple's guides show the
 * interface instead of describing it. Built from the same tokens and classes
 * as the real thing, so it follows light/dark and the trip's palette.
 */
export function HelpPreview({ id }: { id: PreviewId }) {
  const Picture = PICTURES[id];
  return (
    <figure aria-hidden="true" className="pointer-events-none mb-8 select-none overflow-hidden rounded-[20px] bg-gradient-to-br from-accent/50 to-accent/25 px-5 py-7 dark:from-accent/40 dark:to-accent/[0.18]">
      <div className="mx-auto max-w-[19rem]">
        <Picture />
      </div>
    </figure>
  );
}

/** the ring round the thing to tap */
function Mark({ children, className = "", round = false }: { children: ReactNode; className?: string; round?: boolean }) {
  return (
    <span className={`ring-2 ring-accent ring-offset-2 ring-offset-surface ${round ? "rounded-full" : "rounded-[10px]"} ${className}`}>
      {children}
    </span>
  );
}

/** a grouped-inset card, as the app draws one */
const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`overflow-hidden rounded-[12px] bg-surface shadow-[0_6px_20px_rgb(0_0_0/0.12)] ring-1 ring-black/[0.04] dark:ring-white/10 ${className}`}>{children}</div>
);

const Row = ({ children, last = false, className = "" }: { children: ReactNode; last?: boolean; className?: string }) => (
  <div className={`flex items-center gap-3 px-3.5 py-2.5 ${last ? "" : "border-b border-line"} ${className}`}>{children}</div>
);

const Label = ({ children }: { children: ReactNode }) => <span className="block text-[13px] leading-snug text-ink-soft">{children}</span>;

function PlaceCard() {
  return (
    <Card className="px-3.5 pb-1 pt-3.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[17px] font-medium leading-tight text-ink">Sensō-ji</p>
          <p className="text-[13px] text-ink-soft">Open 06:00–17:00</p>
        </div>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-ink/[0.06] text-ink-soft">
          <Icon name="close" size={11} />
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        <PlaceButton icon="map" label="Google Maps" primary />
        <PlaceButton icon="locate" label="Map" />
        <PlaceButton icon="calendar" label="Calendar" />
      </div>
      <p className="mt-3.5 text-[11px] uppercase tracking-wide text-ink-faint">Good to know</p>
      <div className="mt-1">
        <Fact label="Hours" value="06:00–17:00" />
        <Fact label="Entry" value="Free" />
        <div className="-mx-1 my-1.5 px-1">
          <Mark className="block px-2 py-1.5">
            <Label>Website</Label>
            <span className="text-[15px] text-accent">senso-ji.jp</span>
          </Mark>
        </div>
      </div>
    </Card>
  );
}

const PlaceButton = ({ icon, label, primary = false }: { icon: IconName; label: string; primary?: boolean }) => (
  <span className={`flex flex-1 flex-col items-center gap-0.5 rounded-[10px] py-2 text-[11px] ${primary ? "bg-accent text-white" : "bg-ink/[0.06] text-accent"}`}>
    <Icon name={icon} size={16} />
    {label}
  </span>
);

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div className="border-b border-line py-1.5">
    <Label>{label}</Label>
    <span className="text-[15px] text-ink">{value}</span>
  </div>
);

function SyncStates() {
  const states: [string, string][] = [
    ["bg-ink-faint", "Saving…"],
    ["bg-matcha", "Saved"],
    ["bg-gold", "Offline"],
    ["bg-danger", "Couldn't save — retrying"],
  ];
  return (
    <div className="flex flex-col items-end gap-2.5">
      {states.map(([dot, label]) => (
        <span key={label} className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-ink-soft">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {label}
        </span>
      ))}
    </div>
  );
}

function MapControls() {
  return (
    <div className="relative h-44 overflow-hidden rounded-[14px] bg-bg shadow-[0_6px_20px_rgb(0_0_0/0.12)] ring-1 ring-black/[0.04] dark:ring-white/10">
      {/* streets, roughly */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-0 right-0 top-14 h-2 bg-surface" />
        <div className="absolute bottom-0 left-16 top-0 w-2 bg-surface" />
        <div className="absolute left-0 right-0 top-32 h-1.5 bg-surface" />
        <div className="absolute bottom-0 left-40 top-0 w-1.5 bg-surface" />
      </div>
      <span className="absolute left-[6.5rem] top-[4.6rem] h-4 w-4 rounded-full border-[3px] border-white bg-accent shadow-[0_0_0_8px_rgb(var(--c-accent)/0.18)]" />
      <div className="absolute right-3 top-3 flex flex-col items-center gap-2.5">
        <span className="glass flex flex-col overflow-hidden rounded-full text-ink">
          <span className="grid h-9 w-9 place-items-center"><Icon name="plus" size={16} /></span>
          <span className="grid h-9 w-9 place-items-center"><Icon name="minus" size={16} /></span>
        </span>
        <Mark round>
          <span className="glass grid h-9 w-9 place-items-center rounded-full text-accent"><Icon name="location" size={16} /></span>
        </Mark>
      </div>
    </div>
  );
}

function StepRow() {
  return (
    <Card>
      <div className="flex items-center gap-3 px-3.5 py-3.5">
        <span className="w-10 text-right">
          <Mark className="inline-grid h-6 w-7 place-items-center text-ink-faint">
            <Icon name="clock" size={13} />
          </Mark>
        </span>
        <Mark>
          <IconTile size="sm" name="pin" tone="ink-faint" className="opacity-70" />
        </Mark>
        <span className="min-w-0 flex-1 text-[17px] leading-snug text-ink">Coffee first</span>
      </div>
    </Card>
  );
}

function SwipeDelete() {
  return (
    <div className="space-y-4">
      <Card className="relative">
        <div className="flex">
          <div className="flex min-w-0 flex-1 -translate-x-0 items-center gap-3 px-3.5 py-3">
            <IconTile name="ticket" tone="gold" />
            <span className="text-[17px] text-ink">Museum tickets</span>
          </div>
          <span className="grid w-24 place-items-center bg-danger text-[15px] text-white">Delete</span>
        </div>
      </Card>
      <div className="flex items-center justify-between rounded-[14px] bg-ink px-4 py-2.5 text-[15px] text-bg">
        <span>Deleted Museum tickets</span>
        <Mark className="px-1.5 font-medium">Undo</Mark>
      </div>
    </div>
  );
}

function RowMenu() {
  return (
    <div className="relative">
      <Card>
        <Row last>
          <IconTile name="ticket" tone="gold" />
          <span className="min-w-0 flex-1 text-[17px] text-ink">Museum tickets</span>
          <Mark round className="grid h-7 w-7 place-items-center text-ink-faint">
            <Icon name="more" size={16} />
          </Mark>
        </Row>
      </Card>
      <div className="glass-panel ml-auto mt-2 w-44 overflow-hidden rounded-[14px] text-[15px]">
        <p className="border-b border-line px-3.5 py-2 text-ink">Rename</p>
        <p className="border-b border-line px-3.5 py-2 text-ink">Move up</p>
        <p className="px-3.5 py-2 text-danger">Delete</p>
      </div>
    </div>
  );
}

function Keypad() {
  return (
    <Card className="px-4 pb-3 pt-4">
      <div className="flex items-center justify-between">
        <span className="text-[28px] font-medium tabular-nums text-ink">¥1,200</span>
        <Mark className="px-2 py-1 text-[15px] text-accent">JPY</Mark>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[17px] text-ink">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"].map((k) => (
          <span key={k} className="rounded-[8px] bg-ink/[0.05] py-1.5">{k}</span>
        ))}
      </div>
    </Card>
  );
}

function SearchButton() {
  return (
    <div className="flex items-center gap-3">
      <div className="glass flex flex-1 justify-around rounded-full px-2 py-2 text-[11px] text-ink-soft">
        {(["itinerary", "map", "vault"] as const).map((n, i) => (
          <span key={n} className={`flex flex-col items-center gap-0.5 rounded-full px-3 py-0.5 ${i === 0 ? "bg-ink/[0.06] text-accent" : ""}`}>
            <Icon name={n} size={18} />
            {["Plan", "Map", "Logbook"][i]}
          </span>
        ))}
      </div>
      <Mark round>
        <span className="glass grid h-12 w-12 place-items-center rounded-full text-ink"><Icon name="search" size={19} /></span>
      </Mark>
    </div>
  );
}

function DayOrder() {
  const day = (date: string, title: string, lifted = false) => (
    <div className={`flex items-center gap-3 px-3.5 py-2.5 ${lifted ? "relative z-10 -mx-1 rotate-[-1deg] rounded-[12px] bg-surface shadow-[0_8px_24px_rgb(0_0_0/0.16)]" : "border-b border-line"}`}>
      {lifted ? (
        <Mark className="px-0.5 text-ink-faint"><Icon name="grip" size={14} /></Mark>
      ) : (
        <span className="px-0.5 text-ink-faint"><Icon name="grip" size={14} /></span>
      )}
      <span className="w-14 text-[13px] text-ink-soft">{date}</span>
      <span className="flex-1 text-[17px] text-ink">{title}</span>
      <Icon name="chevron" size={12} className="text-ink-faint" />
    </div>
  );
  return (
    <Card className="overflow-visible">
      {day("Tue 3", "Arrival")}
      {day("Wed 4", "Temples", true)}
      {day("Thu 5", "A day out")}
    </Card>
  );
}

function PastDays() {
  return (
    <Card>
      <Row>
        <span className="w-14 text-[13px] text-ink-soft">Today</span>
        <span className="flex-1 text-[17px] text-ink">Temples</span>
        <Icon name="chevron" size={12} className="text-ink-faint" />
      </Row>
      <Row>
        <span className="w-14 text-[13px] text-ink-soft">Fri 6</span>
        <span className="flex-1 text-[17px] text-ink">A day out</span>
        <Icon name="chevron" size={12} className="text-ink-faint" />
      </Row>
      <div className="p-1.5">
        <Mark className="flex items-center justify-between px-2 py-1.5 text-[17px] text-accent">
          Past days
          <Icon name="chevron" size={12} />
        </Mark>
      </div>
    </Card>
  );
}

function FileOffline() {
  return (
    <Card>
      <Row>
        <IconTile name="ticket" tone="gold" />
        <span className="flex-1 text-[17px] text-ink">Train tickets.pdf</span>
        <Icon name="check" size={14} className="text-matcha" />
      </Row>
      <Row last>
        <IconTile name="bed" tone="ai" />
        <span className="flex-1 text-[17px] text-ink">Hotel booking.pdf</span>
        <Mark round className="grid h-7 w-7 place-items-center text-ink-faint">
          <Icon name="cloud-down" size={15} />
        </Mark>
      </Row>
    </Card>
  );
}

function AreaCategory() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="p-3.5">
        <p className="text-[11px] uppercase tracking-wide text-ink-faint">Category</p>
        <p className="mt-0.5 text-[13px] text-ink-soft">what it is</p>
        <div className="mt-3 flex items-center gap-2">
          <IconTile glyph="coffee" tone="gold" size="sm" />
          <span className="text-[15px] text-ink">Coffee</span>
        </div>
      </Card>
      <Card className="p-3.5">
        <p className="text-[11px] uppercase tracking-wide text-ink-faint">Area</p>
        <p className="mt-0.5 text-[13px] text-ink-soft">where it is</p>
        <div className="mt-3 flex items-center gap-2">
          <IconTile name="pin" tone="matcha" size="sm" />
          <span className="text-[15px] text-ink">Asakusa</span>
        </div>
      </Card>
    </div>
  );
}

function Warning() {
  return (
    <Card>
      <div className="px-3.5 py-3">
        <p className="text-[17px] leading-snug text-ink">Nakamise Shopping Street</p>
        <Mark className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 text-[13px] text-danger">
          <Icon name="alert" size={12} /> Overwhelming
        </Mark>
      </div>
    </Card>
  );
}

const PICTURES: Record<PreviewId, () => ReactNode> = {
  placeCard: PlaceCard,
  syncStates: SyncStates,
  mapControls: MapControls,
  stepRow: StepRow,
  swipeDelete: SwipeDelete,
  rowMenu: RowMenu,
  keypad: Keypad,
  searchButton: SearchButton,
  dayOrder: DayOrder,
  pastDays: PastDays,
  fileOffline: FileOffline,
  areaCategory: AreaCategory,
  warning: Warning,
};
