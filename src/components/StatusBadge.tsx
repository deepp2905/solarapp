import { PROJECT_STATUS_LABEL, type ProjectStatus } from "../data";

/**
 * Project status indicator: a colored dot + label for in-progress,
 * label only (no dot) for completed / not-started.
 */
export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const showDot = status === "in-progress";

  return (
    <span className={`status-badge status-badge--${status}`}>
      {showDot && <span className="status-badge-dot" />}
      {PROJECT_STATUS_LABEL[status]}
    </span>
  );
}
