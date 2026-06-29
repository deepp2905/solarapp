import { useEffect, useState } from "react";
import type { Evidence } from "../data";
import { IconImage, IconTrash } from "./Icon";
import ConfirmDialog from "./ConfirmDialog";

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
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Simulate an upload/processing delay for freshly added images.
  const showSkeleton = Boolean(loading);
  useEffect(() => {
    if (!loading) return;
    const delay = 1000 + Math.random() * 1000; // 1–2s
    const t = setTimeout(() => onLoaded?.(), delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  function confirmDelete() {
    setConfirmOpen(false);
    onDelete?.();
  }

  if (showSkeleton) {
    return (
      <div className="evidence-card">
        <div className="evidence-preview evidence-preview--loading">
          <div className="skeleton skeleton-preview" />
        </div>
        <div className="evidence-meta-block">
          <div className="skeleton skeleton-pill" />
          <div className="skeleton skeleton-line" />
        </div>
      </div>
    );
  }

  return (
    <div className={`evidence-card${gpsFailed ? " evidence-card--failed" : ""}`}>
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
              <span className="pill pill-error-soft">GPS failed</span>
              {evidence.distanceMi !== undefined && (
                <span className="pill pill-error-soft">
                  {evidence.distanceMi} mi from site
                </span>
              )}
            </>
          ) : (
            <span className="pill pill-ok">GPS verified</span>
          )}
        </div>

        <div className="evidence-info-top">
          <span className="evidence-name" title={evidence.displayName}>
            {evidence.displayName}
          </span>
          <button
            type="button"
            className="icon-btn evidence-delete"
            aria-label="Delete file"
            title="Delete file"
            onClick={() => setConfirmOpen(true)}
          >
            <IconTrash className="icon-16" />
          </button>
        </div>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          title={`Delete ${evidence.displayName}?`}
          subtitle="This file will be permanently removed from this item. This can't be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
