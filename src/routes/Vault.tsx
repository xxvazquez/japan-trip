import { Link } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { useData } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { Editable } from "@/components/Editable";

export default function Vault() {
  const data = useData();
  const setNote = useApp((s) => s.setNote);
  if (!data) return null;

  const groups = groupBy(data.packing, (p) => p.group);

  return (
    <Page>
      <PageTitle kicker="Admin drawer">Vault</PageTitle>

      {data.docs.length > 0 && (
        <section className="mb-8">
          <h2 className="kicker mb-2">Documents</h2>
          <p className="mb-3 text-xs text-ink-faint">
            Reference details only — kept on this device, never uploaded.
          </p>
          <div className="space-y-2">
            {data.docs.map((d) => (
              <div key={d.id} className="rounded-lg border border-line px-4 py-3 text-sm">
                <p className="font-medium">{d.title}</p>
                <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-ink-faint">
                  {d.fields.map((f, i) => (
                    <div key={i}><dt className="inline">{f.label}: </dt><dd className="inline text-ink-soft">{f.value}</dd></div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.packing.length > 0 && (
        <section className="mb-8">
          <h2 className="kicker mb-2">Packing</h2>
          <div className="space-y-4">
            {Object.entries(groups).map(([group, items]) => (
              <div key={group}>
                <p className="mb-1 text-sm font-medium">{group}</p>
                <ul>
                  {items.map((it) => (
                    <PackRow key={it.id} id={it.id} label={it.label} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.etiquette.length > 0 && (
        <section className="mb-8">
          <h2 className="kicker mb-2">Etiquette</h2>
          <div className="space-y-2">
            {data.etiquette.map((e) => (
              <details key={e.id} className="rounded-lg border border-line px-4 py-3 text-sm">
                <summary className="cursor-pointer font-medium">{e.title}{e.context && <span className="ml-2 text-xs text-ink-faint">{e.context}</span>}</summary>
                <p className="mt-2 text-ink-soft">{e.body}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="kicker mb-2">Notes</h2>
        <div className="rounded-xl border border-line p-4 text-sm leading-relaxed">
          <Editable
            as="textarea"
            label="Notes"
            value={data.notes["notepad"] ?? ""}
            placeholder="Anything you want to remember. Saves to this device."
            onCommit={(v) => setNote("notepad", v)}
          />
        </div>
      </section>

      <p className="mt-8 text-xs text-ink-faint">
        Structural changes (sections, dates, what appears) live in{" "}
        <Link to="/manage" className="text-accent">Manage</Link>.
      </p>
    </Page>
  );
}

function PackRow({ id, label }: { id: string; label: string }) {
  const done = useApp((s) => !!s.data?.progress.checks[`pack:${id}`]);
  const toggle = useApp((s) => s.setCheck);
  return (
    <li>
      <label className="flex cursor-pointer items-center gap-2.5 border-t border-line py-2 text-sm first:border-0">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => toggle(`pack:${id}`, e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        <span className={done ? "text-ink-faint line-through" : ""}>{label}</span>
      </label>
    </li>
  );
}

function groupBy<T>(list: T[], key: (x: T) => string): Record<string, T[]> {
  return list.reduce<Record<string, T[]>>((acc, x) => {
    (acc[key(x)] ??= []).push(x);
    return acc;
  }, {});
}
