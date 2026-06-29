import type { Evidence } from "../data";
import { IconImage, IconTrash } from "./Icon";

interface Props {
  evidence: Evidence;
  onDelete?: () => void;
}

/** A captured-evidence tile: image preview on top, status pills + filename below. */
export default function EvidenceCard({ evidence, onDelete }: Props) {
  const gpsFailed = evidence.gps === "failed";

  function handleDelete() {
    if (window.confirm("Delete this file? This can't be undone.")) {
      onDelete?.();
    }
  }

  return (
    <div className="evidence-card">
      <div
        className="evidence-preview"
        style={
          evidence.thumbnailUrl
            ? { backgroundImage: `url(${evidence.thumbnailUrl})` }
            : undefined
        }
      >
        {!evidence.thumbnailUrl && (
          <IconImage className="evidence-preview-icon" />
        )}
      </div>

      <div className="evidence-meta-block">
        <div className="evidence-pills">
          {gpsFailed ? (
            <>
              <span className="pill pill-error-soft">GPS Failed</span>
              {evidence.distanceMi !== undefined && (
                <span className="pill pill-error-soft">
                  {evidence.distanceMi} mi from site
                </span>
              )}
            </>
          ) : (
            <span className="pill pill-ok">GPS OK</span>
          )}
        </div>

        <div className="evidence-info-top">
          <span className="evidence-name">{evidence.displayName}</span>
          <button
            type="button"
            className="icon-btn"
            aria-label="Delete file"
            title="Delete file"
            onClick={handleDelete}
          >
            <IconTrash className="icon-16" />
          </button>
        </div>
      </div>
    </div>
  );
}
