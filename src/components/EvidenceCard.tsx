import { useEffect } from "react";
import type { Evidence } from "../data";
import { IconImage, IconTrash } from "./Icon";

interface Props {
  evidence: Evidence;
  /** Show a skeleton loader (random 1–2s) — used for just-added images. */
  loading?: boolean;
  /** Called once the simulated load completes. */
  onLoaded?: () => void;
  onDelete?: () => void;
}

/** A captured-evidence tile: image preview on top, status pills + filename below. */
export default function EvidenceCard({
  evidence,
  loading,
  onLoaded,
  onDelete,
}: Props) {
  const gpsFailed = evidence.gps === "failed";

  // Simulate an upload/processing delay for freshly added images.
  const showSkeleton = Boolean(loading);
  useEffect(() => {
    if (!loading) return;
    const delay = 1000 + Math.random() * 1000; // 1–2s
    const t = setTimeout(() => onLoaded?.(), delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
          evidence.thumbnailUrl && !showSkeleton
            ? { backgroundImage: `url(${evidence.thumbnailUrl})` }
            : undefined
        }
      >
        {showSkeleton ? (
          <div className="evidence-skeleton" />
        ) : (
          !evidence.thumbnailUrl && (
            <IconImage className="evidence-preview-icon" />
          )
        )}
      </div>

      <div className="evidence-meta-block">
        <div className="evidence-pills">
          {gpsFailed ? (
            <>
              <span className="pill pill-error-soft">GPS failed</span>
              {evidence.distanceMi !== undefined && (
                <span className="pill pill-error-soft">
                  {evidence.distanceMi} mi from site
                </span>
              )}
            </>
          ) : (
            <span className="pill pill-ok">GPS Verified</span>
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
