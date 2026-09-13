import { useState, type ReactNode } from "react";
import { Page, PageHeader } from "@/components/Page";
import { Section } from "@/components/Section";
import { Icon } from "@/components/Icon";
import { INSET_DIVIDER } from "@/components/InsetRow";

/** One question, as a disclosure row — closed by default, like an iOS
 *  Settings row: the question is what you scan, the answer is what you tap
 *  for. Chevron rotates the same way `<Section>`'s own header does. */
function QA({ q, children }: { q: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={INSET_DIVIDER}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
      >
        <span className="value min-w-0 flex-1">{q}</span>
        <Icon name="chevron" size={14} className={`shrink-0 text-ink-faint transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && <p className="note -mt-1 px-3.5 pb-3.5 text-ink-soft">{children}</p>}
    </li>
  );
}

/**
 * A plain-language answer sheet for the non-obvious bits — the things a
 * feature's own ⓘ toggle explains one line at a time, gathered in one place
 * for whoever's new to the app (a co-traveller signing in for the first
 * time). Not a replacement for the README (that's the technical/setup doc);
 * this is "why does it do that" for people using the trip, not building it.
 */
export default function Help() {
  return (
    <Page>
      <PageHeader back="/manage" title="Help & FAQ" meta="Tap a question for the answer." />

      <div className="space-y-6">
        <Section title="Money & spending">
          <ul>
            <QA q="What are “modes” in Expense categories?">
              A mode is just how you travelled — train, bus, subway, taxi, flight, ferry, car, or on
              foot. In Manage → Setup → Expense categories, tap “+ modes” on a category (like
              “Train” or “Taxi”) to make it claim one or more of these. From then on, any journey
              fare using that mode is counted under that category automatically — you don't pick a
              category by hand for every fare. A mode nobody's claimed falls to whichever category
              is marked “auto: fares” (Transport, by default).
            </QA>
            <QA q="Why does a spending row already have an icon?">
              Expenses guesses one for you — from the modes a category claims, from its role (a
              stay gets a bed, transport gets a transit colour), or from its name. Don't like the
              guess? Pick your own from the “Auto icon” dropdown next to that category in Manage.
            </QA>
            <QA q="What does “Combined” mean on the Expenses tab?">
              It only shows up once the trip has spending in two or more currencies. It converts
              everything into your main currency, using a live exchange rate, and adds it all
              together — each currency still keeps its own untouched section below it.
            </QA>
          </ul>
        </Section>

        <Section title="Planning your days">
          <ul>
            <QA q="Picking a place vs. “Custom…” in a day's Plan — what's the difference?">
              If you've added an Area to that day (further down the same page), its places show up
              in a dropdown so you can pick one directly — the step then links to that place and
              shows on the day's map. “Custom…” is for anything that isn't a place — an errand, a
              reminder, “book train tickets.” Pick it and you get a plain text box instead.
            </QA>
            <QA q="What's the difference between an Area and a category?">
              A category is what a place is — coffee, a sight, a shop. An Area is where it is — a
              neighbourhood you name, like “Old town” or “Near the station.” A place can sit in
              several areas. Add areas from the Map tab, or straight from a day — adding one to a
              day pulls every place in it onto that day's map at once.
            </QA>
            <QA q="What does the “day trip” toggle do?">
              It's for a day where you leave your base and come back the same night. It adds a
              getting‑there / getting‑back card, a packing‑style checklist, and a “last train back”
              field — extra fields a normal day doesn't need.
            </QA>
          </ul>
        </Section>

        <Section title="The Map">
          <ul>
            <QA q="I imported pins from Google My Maps — what does “Sync” do?">
              It re-reads your My Map and refreshes the imported pins to match it. Anything you
              added yourself inside the app — a pin, a note on one — is left alone; Sync only
              touches what came from the import.
            </QA>
          </ul>
        </Section>

        <Section title="Sharing & accounts">
          <ul>
            <QA q="How do I share the trip with someone else?">
              Manage → Sharing → add their email (the one they'll sign in with). From then on you
              both see and edit the exact same trip — changes show up on the other person's screen
              within a second or two.
            </QA>
            <QA q="Why does a trip say “read-only”?">
              That's the built-in Demo — a tour of the app, not a real trip, so it can't be edited.
              Make your own from Manage → Trips → New trip; that one's fully yours.
            </QA>
          </ul>
        </Section>

        <Section title="Using it day to day">
          <ul>
            <QA q="How do I delete something — I see both a swipe and an ×?">
              On a touchscreen, swipe a row left to reveal Delete. With a mouse or trackpad, use the
              × (or the ⋯ menu) instead — there's nothing to swipe there.
            </QA>
            <QA q="Can I put this on my home screen like a real app?">
              Yes — open the link in Safari or Chrome, then Share → Add to Home Screen. It opens
              full-screen with no browser bar, and still works offline for anything already loaded.
            </QA>
          </ul>
        </Section>
      </div>
    </Page>
  );
}
