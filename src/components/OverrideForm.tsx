import { useState } from "react";

const MIN_NOTE = 10;

interface Props {
  initialNote?: string;
  onSave?: (note: string) => void;
}

/**
 * Page-level GPS override: a required reason for why GPS is unavailable or
 * outside tolerance. Save stays disabled until the note meets the minimum.
 */
export default function OverrideForm({ initialNote = "", onSave }: Props) {
  const [note, setNote] = useState(initialNote);
  const valid = note.trim().length >= MIN_NOTE;

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
      />

      <button
        type="button"
        className="btn btn-take btn-save"
        disabled={!valid}
        onClick={() => valid && onSave?.(note.trim())}
      >
        Save
      </button>
    </section>
  );
}
