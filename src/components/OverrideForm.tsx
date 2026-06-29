import { useState } from "react";

interface Props {
  initialNote?: string;
  onSave?: (note: string) => void;
}

/**
 * Page-level GPS override: a reason for why GPS is unavailable or outside
 * tolerance. Once saved, the note is locked (read-only) and Save becomes Edit;
 * clicking Edit re-opens the field for changes.
 */
export default function OverrideForm({ initialNote = "", onSave }: Props) {
  const [note, setNote] = useState(initialNote);
  const [saved, setSaved] = useState(Boolean(initialNote));

  const canSave = note.trim().length > 0;

  function handleClick() {
    if (saved) {
      // Switch back to editing
      setSaved(false);
      return;
    }
    if (!canSave) return;
    const trimmed = note.trim();
    setNote(trimmed);
    onSave?.(trimmed);
    setSaved(true);
  }

  return (
    <section className="override">
      <h2 className="override-title">
        Why is GPS unavailable or outside tolerance?{" "}
        <span className="override-required">(Required)</span>
      </h2>

      <textarea
        className="override-input"
        placeholder="e.g. Interior install — no GPS signal inside the garage."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        readOnly={saved}
        // When saved, take it out of the tab order so it reads as locked,
        // not as an active field.
        tabIndex={saved ? -1 : 0}
        aria-readonly={saved}
      />

      <button
        type="button"
        className="btn-browse btn-save"
        disabled={!saved && !canSave}
        onClick={handleClick}
      >
        {saved ? "Edit" : "Save"}
      </button>
    </section>
  );
}
