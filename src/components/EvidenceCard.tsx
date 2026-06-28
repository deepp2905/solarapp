import { useState } from "react";
import type { Evidence } from "../data";
import { PROJECT } from "../data";
import { IconGpsOff, IconPin, IconTrash } from "./Icon";

const MIN_NOTE = 10;

interface Props {
  evidence: Evidence;
  onDelete?: () => void;
  onSaveOverride?: (note: string) => void;
}

/**
 * One captured-photo card. When GPS failed, it surfaces a clear "resolve"
 * action and an override form that requires a documented reason.
 */
export default function EvidenceCard({
  evidence,
  onDelete,
  onSaveOverride,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(evidence.overrideNote ?? "");

  const gpsFailed = evidence.gps === "failed";
  const resolved = Boolean(evidence.overrideNote);
  const noteValid = note.trim().length >= MIN_NOTE;

  // Status reflects the *unresolved* failure: only "Ready" once resolved.
  const statusPill =
    gpsFailed && !resolved ? (
      <span className="pill pill-error">
        <IconGpsOff className="pill-icon" /> Action needed
      </span>
    ) : (
      <span className="pill pill-ok">Ready</span>
    );

  const distanceLabel =
    evidence.distanceMi !== undefined
      ? `${evidence.distanceMi} mi from site (tolerance ${PROJECT.gpsToleranceMi} mi)`
      : null;

  function handleDelete() {
    if (window.confirm("Delete this photo? This can't be undone.")) {
      onDelete?.();
    }
  }

  function handleSave() {
    if (!noteValid) return;
    onSaveOverride?.(note.trim());
    setEditing(false);
  }

  return (
    <div className={`evidence-card${gpsFailed && !resolved ? " is-error" : ""}`}>
      <div className="evidence-card-head">
        <div className="evidence-thumb">IMG</div>

        <div className="evidence-info">
          <div className="evidence-name">{evidence.displayName}</div>
          <div className="evidence-pills">
            {statusPill}
            {gpsFailed && (
              <span className="pill pill-error-soft">
                <IconGpsOff className="pill-icon" /> GPS failed
              </span>
            )}
            {distanceLabel && (
              <span className="evidence-meta">{distanceLabel}</span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="icon-btn"
          aria-label="Delete photo"
          title="Delete photo"
          onClick={handleDelete}
        >
          <IconTrash className="icon-18" />
        </button>
      </div>

      {gpsFailed && resolved && !editing && (
        <div className="evidence-foot resolved">
          <div className="override-saved">
            <strong>Override saved.</strong> {evidence.overrideNote}
          </div>
          <button
            type="button"
            className="btn-link"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>
      )}

      {gpsFailed && !resolved && !editing && (
        <div className="evidence-foot">
          <div className="alert-text">
            <IconPin className="icon-14" />
            GPS check failed — a documented reason is required before sign-off.
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setEditing(true)}
          >
            Add override note
          </button>
        </div>
      )}

      {editing && (
        <div className="evidence-foot column">
          <label className="override-label" htmlFor="override-note">
            Why is GPS unavailable or outside tolerance?
          </label>
          <textarea
            id="override-note"
            className="override-input"
            placeholder="e.g. Interior install — no GPS signal inside the garage."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
          <div className="override-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!noteValid}
              onClick={handleSave}
            >
              Save override
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => {
                setNote(evidence.overrideNote ?? "");
                setEditing(false);
              }}
            >
              Cancel
            </button>
            <span className="override-hint">
              {noteValid
                ? "Looks good."
                : `Add at least ${MIN_NOTE} characters.`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
