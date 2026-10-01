import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBackToClose } from "@/lib/backClose";

/**
 * The iOS alert with a text field — Photos' "New Album", Notes' "New
 * Folder": a small centred card with a title, an optional message, one
 * field, and Cancel | <action> side by side under a hairline. The action is
 * the bold one and stays disabled until there's text (or while the text is
 * unchanged, when renaming). Enter submits, Escape or Back cancels.
 *
 * Centred in the part of the screen the keyboard leaves visible (`--vvh` /
 * `--vvt`, `src/lib/keyboard.ts`), so it never sits under the keyboard.
 */
export function TextPrompt({
  open,
  title,
  message,
  initial = "",
  placeholder,
  action,
  onSubmit,
  onClose,
}: {
  open: boolean;
  title: string;
  message?: string;
  initial?: string;
  placeholder?: string;
  /** the confirming button — "Add", "Save", "Create" */
  action: string;
  onSubmit: (text: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);
  useBackToClose(open, onClose);

  // focus as soon as the field exists — taking over from `primeKeyboard`
  // (called by the opening tap) keeps the iOS keyboard up
  useLayoutEffect(() => {
    if (!open) return;
    setText(initial);
    inputRef.current?.focus({ preventScroll: true });
  }, [open, initial]);

  if (!open) return null;
  const value = text.trim();
  const canSubmit = value !== "" && value !== initial.trim();
  const submit = () => {
    if (!canSubmit) return;
    onSubmit(value);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-x-0 top-[var(--vvt,0px)] z-[70] grid h-[var(--vvh,100dvh)] place-items-center bg-black/25 px-6 motion-safe:animate-fade-in"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="text-prompt-title"
        className="glass-panel w-full max-w-[270px] overflow-hidden rounded-[14px] text-center motion-safe:animate-alert-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Enter") submit();
        }}
      >
        <div className="px-4 pb-4 pt-5">
          <h2 id="text-prompt-title" className="break-words text-[17px] font-semibold leading-snug text-ink">{title}</h2>
          {message && <p className="mt-1 break-words text-[13px] leading-snug text-ink">{message}</p>}
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder={placeholder}
            enterKeyHint="done"
            autoCapitalize="sentences"
            className="mt-4 w-full rounded-[7px] border border-ink/15 bg-surface px-2 py-1.5 text-left text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-accent"
          />
        </div>
        <div className="flex border-t border-ink/15 text-[17px]">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 text-accent active:bg-ink/[0.07]">
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="flex-1 border-l border-ink/15 py-2.5 font-semibold text-accent active:bg-ink/[0.07] disabled:text-ink-faint"
          >
            {action}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
