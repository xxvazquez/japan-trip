import { createContext, useContext, useEffect, useState, type ReactNode, type RefObject } from "react";
import { Link } from "react-router-dom";
import { ActionSheet } from "./ActionSheet";
import { ActionRow } from "./ActionRow";
import { ContextMenu } from "./ContextMenu";
import { Icon } from "./Icon";
import { IconTile } from "./IconTile";
import { INSET_DIVIDER } from "./InsetRow";
import { Markdown } from "./Markdown";
import { PlaceAction, PlaceActions } from "./PlaceAction";
import { PlaceFactRows } from "./PlaceFacts";
import { TitleLineTile } from "./TileRow";
import { fmtDate } from "@/lib/dates";
import { placeMapLink } from "@/lib/maps";
import { factsDayHours, hasFacts, notASight } from "@/lib/placeFacts";
import { nearestOpeningHours, type PlaceHours } from "@/lib/placeHours";
import { hoursForDate } from "@/lib/openingHours";
import { menuHref, reviewHref, reviewSiteFor } from "@/lib/reviewSite";
import { placeTile } from "@/lib/tones";
import type { NearbyGroup, NearbyItem } from "@/lib/nearby";
import type { Place } from "@/core/types";
import { fmtClocksIn } from "@/lib/time";
import { useApp } from "@/store/useApp";

/** A place's opening hours on `date`, the rule for that month and weekday
 *  rather than the whole year's schedule. Read first from the place's "Good
 *  to know" Hours and Closed lines — what its place card shows — else from
 *  OpenStreetMap's tag (`hoursForDate`; a date no rule covers is a closed
 *  one). Null when neither has anything, and always for somewhere you pass
 *  through or sleep (`notASight`) — a station's tag nearby is a ticket
 *  counter's or a kiosk's, not when the trains stop. */
export function usePlaceHours(place: Place | undefined, date?: string): string | null {
  const data = useApp((s) => s.data);
  const skip = !place || !data || notASight(place, data);
  const [hours, setHours] = useState<PlaceHours | null>(null);
  useEffect(() => {
    setHours(null);
    if (!place || skip) return;
    let cancelled = false;
    void nearestOpeningHours(place.lat, place.lng, place.name).then((h) => { if (!cancelled) setHours(h); });
    return () => { cancelled = true; };
  }, [place?.id, place?.lat, place?.lng, skip]);
  if (skip) return null;
  const fromFacts = date ? factsDayHours(place?.facts, date) : undefined;
  if (fromFacts) return fromFacts;
  return hours ? (date ? hoursForDate(hours.hours, date) ?? "Closed" : hours.hours) : null;
}

/** what a suggestion's card is opened with: the place, the stop it's near
 *  and the row it hangs off on a wide screen */
export interface NearbyOpen {
  item: NearbyItem;
  group: NearbyGroup;
  anchor: HTMLElement | null;
}

interface NearbyCtx {
  /** the day's suggestions, by the plan step they're near */
  byStep: Map<string, NearbyGroup>;
  open: (o: NearbyOpen) => void;
  /** puts the place in the plan right after the stop it's near */
  add: (group: NearbyGroup, place: Place) => void;
}

const Ctx = createContext<NearbyCtx | null>(null);

export function NearbyProvider({ value, children }: { value: NearbyCtx; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** a plan step's own suggestions, and the way to open one — for its place card */
export function useStepNearby(stepId: string) {
  const ctx = useContext(Ctx);
  return { group: ctx?.byStep.get(stepId), open: ctx?.open, add: ctx?.add };
}

/** "Wed 14 Oct" */
const shortDate = (iso: string, locale?: string) => fmtDate(iso, locale, { weekday: "short", day: "numeric", month: "short" });

/** the quiet line under a suggestion: how far, and why it's worth a look */
function NearbyMeta({ item, locale }: { item: NearbyItem; locale?: string }) {
  return (
    <span className="mt-0.5 block break-words text-xs leading-snug text-ink-faint">
      <span className="whitespace-nowrap">
        <Icon name="walk" size={12} className="mr-0.5 inline-block align-[-2px]" />
        ≈&nbsp;{item.min} min
      </span>
      {item.meal && <> · For {item.meal}</>}
      {item.plannedOn && (
        <> · <span className="whitespace-nowrap">Planned {shortDate(item.plannedOn, locale)}</span></>
      )}
    </span>
  );
}

/** One suggestion as a grouped-list row: the place's own tile, its name,
 *  how far it is — the row opens its card; ＋ adds it after the stop it's
 *  near (also on a long-press / right-click). */
export function NearbyRow({ item, group, locale, categoryIcons, categoryColors, readOnly, divider, onOpen, onAdd }: {
  item: NearbyItem;
  group: NearbyGroup;
  locale?: string;
  categoryIcons?: Record<string, string>;
  categoryColors?: Record<string, string>;
  readOnly: boolean;
  /** a hairline under it — off on the last row before the next stop */
  divider: boolean;
  onOpen: (anchor: HTMLElement) => void;
  onAdd: () => void;
}) {
  const p = item.place;
  const mapHref = placeMapLink(p);
  return (
    <li className={divider ? INSET_DIVIDER.replace("after:left-3.5", "after:left-12") : ""}>
      <ContextMenu
        menu={
          <>
            {!readOnly && (
              <button type="button" className="menu-item" onClick={onAdd}>
                <Icon name="plus" size={16} /> Add after {group.stop.name}
              </button>
            )}
            {mapHref && (
              <a href={mapHref} target="_blank" rel="noopener" className="menu-item">
                <Icon name="map" size={16} /> Open in Google Maps
              </a>
            )}
          </>
        }
      >
        <div className="flex items-center gap-1 pr-2">
          <button
            type="button"
            onClick={(e) => onOpen(e.currentTarget)}
            className="flex min-w-0 flex-1 items-center gap-3 py-2.5 pl-3.5 text-left transition-colors duration-150 active:bg-ink/[0.07] focus-visible:[outline-offset:-2px]"
          >
            <TitleLineTile><IconTile size="sm" {...placeTile(p, categoryIcons, categoryColors)} /></TitleLineTile>
            <span className="min-w-0 flex-1">
              <span className="block break-words text-sm leading-snug text-ink">{p.name}</span>
              <NearbyMeta item={item} locale={locale} />
            </span>
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={onAdd}
              aria-label={`Add ${p.name} after ${group.stop.name}`}
              title={`Add after ${group.stop.name}`}
              className="tap grid h-7 w-7 shrink-0 place-items-center rounded-full text-accent transition-opacity active:opacity-50"
            >
              <Icon name="plus" size={18} />
            </button>
          )}
        </div>
      </ContextMenu>
    </li>
  );
}

/** a stop's run of suggestions inside a grouped list, under a quiet
 *  "Near …" label — the way the Plan sets its Morning / Afternoon bands */
export function NearbyGroupRows({ group, first, ...row }: {
  group: NearbyGroup;
  first?: boolean;
  locale?: string;
  categoryIcons?: Record<string, string>;
  categoryColors?: Record<string, string>;
  readOnly: boolean;
  onOpen: (item: NearbyItem, anchor: HTMLElement) => void;
  onAdd: (item: NearbyItem) => void;
}) {
  return (
    <>
      <li className={`break-words px-3.5 pb-0.5 text-xs text-ink-faint ${first ? "pt-2.5" : "pt-3.5"}`}>
        Near {group.stop.name}
      </li>
      {group.items.map((item, i) => (
        <NearbyRow
          key={item.place.id}
          item={item}
          group={group}
          locale={row.locale}
          categoryIcons={row.categoryIcons}
          categoryColors={row.categoryColors}
          readOnly={row.readOnly}
          divider={i < group.items.length - 1}
          onOpen={(a) => row.onOpen(item, a)}
          onAdd={() => row.onAdd(item)}
        />
      ))}
    </>
  );
}

/** A suggestion's place card, laid out like a plan step's (and Apple
 *  Maps'): the name, how far it is from the stop and its hours that day,
 *  ✕; the button row with Google Maps filled; then what's known about it,
 *  and last what you can do with it — add it after the stop, or move it
 *  here from the day that already has it. */
export function NearbyCard({ open, onClose, anchorRef, item, group, date, locale, categoryIcons, readOnly, plannedDayId, onAdd, onMove, onShowOnMap }: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  item: NearbyItem | undefined;
  group: NearbyGroup | undefined;
  date: string;
  locale?: string;
  categoryIcons?: Record<string, string>;
  readOnly: boolean;
  /** the day that already plans it, for "Move here" and its link */
  plannedDayId?: string;
  onAdd: () => void;
  onMove: () => void;
  onShowOnMap: (place: Place) => void;
}) {
  const place = item?.place;
  const hours = usePlaceHours(open ? place : undefined, date);
  if (!item || !group || !place) return null;
  const mapHref = placeMapLink(place);
  const reviewSite = reviewSiteFor(place, categoryIcons);
  const close = (then?: () => void) => () => { onClose(); then?.(); };
  return (
    <ActionSheet
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      doneLabel={null}
      header={
        <div className="space-y-3 md:w-[20rem]">
          <div className="flex items-start gap-3 pl-1">
            <div className="min-w-0 flex-1">
              <h2 className="subhead break-words">{place.name}</h2>
              <p className={`mt-0.5 break-words text-xs ${hours === "Closed" ? "text-danger" : "text-ink-soft"}`}>
                ≈&nbsp;{item.min} min walk from {group.stop.name}
                {hours && <> · {hours === "Closed" ? "Closed this day" : fmtClocksIn(hours.replace(/-/g, "–"))}</>}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="tap grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-ink/[0.08] text-ink-soft"
              aria-label="Close"
            >
              <Icon name="close" size={13} />
            </button>
          </div>
          <PlaceActions>
            {mapHref && <PlaceAction href={mapHref} icon="map" label="Google Maps" primary />}
            {reviewSite && <PlaceAction href={reviewHref(reviewSite, place)} icon="link" label={place.reviewUrl ? reviewSite.label : `Search ${reviewSite.label}`} />}
            <PlaceAction icon="locate" label="Map" onClick={close(() => onShowOnMap(place))} />
          </PlaceActions>
        </div>
      }
    >
      <div onClick={(e) => e.stopPropagation()} className="space-y-4 px-3 pb-3 md:w-[21.5rem]">
        {place.note && (
          <div>
            <p className="kicker px-4 pb-1.5 pt-1">Note</p>
            <div className="rounded-[12px] bg-surface px-3.5 py-3">
              <Markdown text={place.note} className="note" />
            </div>
          </div>
        )}
        {(hasFacts(place.facts) || menuHref(place)) && (
          <div>
            <p className="kicker px-4 pb-1.5 pt-1">Good to know</p>
            <ul className="overflow-hidden rounded-[12px] bg-surface">
              <PlaceFactRows place={place} />
            </ul>
          </div>
        )}
        {(!readOnly || (item.plannedOn && plannedDayId)) && (
          <ul className="overflow-hidden rounded-[12px] bg-surface">
            {!readOnly && <ActionRow icon="plus" label={`Add after ${group.stop.name}`} onClick={close(onAdd)} />}
            {!readOnly && item.plannedOn && plannedDayId && (
              <ActionRow icon="calendar" label={`Move here from ${shortDate(item.plannedOn, locale)}`} onClick={close(onMove)} />
            )}
            {item.plannedOn && plannedDayId && (
              <li className={INSET_DIVIDER}>
                <Link
                  to={`/day/${plannedDayId}`}
                  onClick={onClose}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 text-xs text-ink active:bg-ink/[0.07]"
                >
                  <span className="min-w-0 flex-1 break-words">Planned {shortDate(item.plannedOn, locale)}</span>
                  <Icon name="chevron" size={14} className="-mr-1 shrink-0 text-ink-faint" />
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </ActionSheet>
  );
}
