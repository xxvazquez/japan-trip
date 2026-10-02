import { Icon } from "./Icon";

/** The iOS stepper (UIStepper): a grey rounded pill split into − | +, sized
 *  as iOS draws it (94×32). Each half is a full tap target via `.tap`; an
 *  end that can't go further dims, as on iOS. */
export function Stepper({ onDec, onInc, canDec = true, canInc = true, label }: {
  onDec: () => void;
  onInc: () => void;
  canDec?: boolean;
  canInc?: boolean;
  /** what's being counted — "days" reads "Fewer days" / "More days" */
  label: string;
}) {
  const half = "tap grid h-8 w-[47px] place-items-center text-ink transition-colors active:bg-ink/[0.1] disabled:text-ink-faint disabled:active:bg-transparent";
  return (
    <span className="inline-flex shrink-0 items-center overflow-hidden rounded-[8px] bg-surface-2">
      <button type="button" onClick={onDec} disabled={!canDec} aria-label={`Fewer ${label}`} className={half}>
        <Icon name="minus" size={16} />
      </button>
      <span className="h-[18px] w-px bg-line" aria-hidden="true" />
      <button type="button" onClick={onInc} disabled={!canInc} aria-label={`More ${label}`} className={half}>
        <Icon name="plus" size={16} />
      </button>
    </span>
  );
}
