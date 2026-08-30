import { Editable } from "./Editable";
import type { Access } from "@/core/types";

const GRADES = [
  { value: "", label: "—" },
  { value: "flat", label: "flat" },
  { value: "gentle", label: "gentle" },
  { value: "uphill", label: "uphill" },
];

/** The always-shown access facts: walk from station · flat/gentle/uphill ·
 *  lift yes/no · (optionally) number of changes. All editable. */
export function AccessLine({
  access,
  onChange,
  showConnections,
}: {
  access: Access;
  onChange: (next: Access) => void;
  showConnections?: boolean;
}) {
  const set = (patch: Partial<Access>) => onChange({ ...access, ...patch });

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 rounded-xl border border-line px-4 py-3 text-sm sm:grid-cols-4">
      <Cell label="Walk from station">
        <Editable
          label="Walk minutes"
          as="number"
          value={access.stationWalkMin != null ? String(access.stationWalkMin) : ""}
          placeholder="—"
          onCommit={(v) => set({ stationWalkMin: v ? Number(v) : undefined })}
        />
        {access.stationWalkMin != null && " min"}
      </Cell>
      <Cell label="Underfoot">
        <Editable
          as="select"
          label="Grade"
          value={access.grade ?? ""}
          options={GRADES}
          onCommit={(v) => set({ grade: (v || undefined) as Access["grade"] })}
        />
      </Cell>
      <Cell label="Lift">
        <button
          onClick={() => set({ elevator: !access.elevator })}
          className="editable rounded px-1 text-left"
          type="button"
        >
          {access.elevator ? "yes" : "no"}
        </button>
      </Cell>
      {showConnections && (
        <Cell label="Changes">
          <Editable
            label="Number of changes"
            as="number"
            value={access.connections != null ? String(access.connections) : ""}
            placeholder="0"
            onCommit={(v) => set({ connections: v ? Number(v) : undefined })}
          />
        </Cell>
      )}
    </dl>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-2xs uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}
