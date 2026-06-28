import { useState } from "react";
import type { Evidence } from "../data";
import { IconGpsOff, IconTrash } from "./Icon";

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
  const unresolved = gpsFailed && !resolved;

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
    <div className="evidence-card">
      <div className="evidence-card-head">
        <div
          className="evidence-thumb"
          style={
            evidence.thumbnailUrl
              ? { backgroundImage: `url(${evidence.thumbnailUrl})` }
              : undefined
          }
        >
          {!evidence.thumbnailUrl && "IMG"}
        </div>

        <div className="evidence-info">
          <div className="evidence-info-top">
            <span className="evidence-name">{evidence.displayName}</span>
            <button
              type="button"
              className="icon-btn"
              aria-label="Delete photo"
              title="Delete photo"
              onClick={handleDelete}
            >
              <IconTrash className="icon-16" />
            </button>
          </div>

          <div className="evidence-pills">
            <span className="pill pill-ok">
              {resolved ? "Ready" : gpsFailed ? "Captured" : "Ready"}
            </span>
            {gpsFailed && (
              <span className="pill pill-error-soft">
                <IconGpsOff className="pill-icon" /> GPS Failed
              </span>
            )}
            {evidence.distanceMi !== undefined && (
              <span className="pill pill-error-soft">
                {evidence.distanceMi} mi from site
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Resolved: show the saved note + edit affordance */}
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

      {/* Unresolved: red call-to-action that opens the override form */}
      {unresolved && !editing && (
        <div className="evidence-foot">
          <button
            type="button"
            className="gps-fail-btn"
            onClick={() => setEditing(true)}
          >
            <IconGpsOff className="icon-16" />
            GPS Check Failed — Documentation Required
          </button>
        </div>
      )}

      {/* Override form */}
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
              className="btn btn-take btn-sm"
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
          </div>
        </div>
      )}
    </div>
  );
}
