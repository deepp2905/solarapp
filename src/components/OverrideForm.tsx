import { useState } from "react";
import { IconWarning, IconCheck } from "./Icon";

export interface FailedPhoto {
  displayName: string;
  distanceMi?: number;
}

interface Props {
  initialNote?: string;
  /** the GPS-failed photos this exception covers */
  failures: FailedPhoto[];
  /** project GPS tolerance, for context in the banner */
  toleranceMi: number;
  onSave?: (note: string) => void;
}

/**
 * GPS exception banner: a single connected block that states the problem, names
 * the failed photo(s) and how far off they were, and holds the required reason
 * inline. Once saved, it flips to a green "resolved" state showing the note
 * read-only with an Edit affordance.
 */
export default function OverrideForm({
  initialNote = "",
  failures,
  toleranceMi,
  onSave,
}: Props) {
  const [note, setNote] = useState(initialNote);
  const [saved, setSaved] = useState(Boolean(initialNote));

  const canSave = note.trim().length > 0;

  function handleClick() {
    if (saved) {
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
    <section className={`gps-banner${saved ? " gps-banner--resolved" : ""}`}>
      <div className="gps-banner-head">
        <span className="gps-banner-icon">
          {saved ? (
            <IconCheck className="icon-20" />
          ) : (
            <IconWarning className="icon-20" />
          )}
        </span>
        <h2 className="gps-banner-title">
          {saved
            ? "GPS exception resolved"
            : `The following ${failures.length === 1 ? "image is" : "images are"} outside the ${toleranceMi} mi site tolerance`}
        </h2>
      </div>

      {failures.length > 0 && (
        <ul className="gps-banner-files">
          {failures.map((f) => (
            <li key={f.displayName} className="gps-banner-file">
              <span className="gps-banner-file-name">{f.displayName}</span>
              {f.distanceMi !== undefined && (
                <span className="gps-banner-file-dist">{f.distanceMi} mi</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="gps-banner-field">
        <label className="gps-banner-label" htmlFor="gps-reason">
          Write a short explanation of why the location couldn’t be verified.{" "}
          {!saved && <span className="gps-banner-required">Required</span>}
        </label>

        <textarea
          id="gps-reason"
          className="override-input"
          placeholder="e.g. Interior install — no GPS signal inside the garage."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          readOnly={saved}
          tabIndex={saved ? -1 : 0}
          aria-readonly={saved}
        />

        <div className="gps-banner-actions">
          <button
            type="button"
            className={`btn-save ${saved ? "btn-browse" : "gps-banner-save"}`}
            disabled={!saved && !canSave}
            onClick={handleClick}
          >
            {saved ? "Edit" : "Save reason"}
          </button>
        </div>
      </div>
    </section>
  );
}
