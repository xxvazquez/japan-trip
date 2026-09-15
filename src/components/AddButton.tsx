import { Icon } from "./Icon";

/** The one add-a-thing button, above a stack of cards (or inside an empty state). */
export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="action">
      <Icon name="plus" size={14} /> {label}
    </button>
  );
}
