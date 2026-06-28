import { PROJECT_STATUS_LABEL, type ProjectStatus } from "../data";

/** Pill showing a project's status — a colored dot + label, tinted per status. */
export default function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge-dot" />
      {PROJECT_STATUS_LABEL[status]}
    </span>
  );
}
