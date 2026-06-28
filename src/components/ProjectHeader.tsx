interface Props {
  name: string;
  address: string;
  completed: number;
  total: number;
  /** enabled once every item is captured */
  onReview?: () => void;
}

/** Sticky project header shown beneath the nav on the checklist. */
export default function ProjectHeader({
  name,
  address,
  completed,
  total,
  onReview,
}: Props) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const canReview = completed === total;

  return (
    <div className="project-header">
      <h1 className="project-name">{name}</h1>
      <p className="project-address">{address}</p>

      <div className="project-header-row">
        <div className="progress-wrap">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-count">
            {completed}/{total}
          </span>
        </div>

        <button
          type="button"
          className="review-btn"
          disabled={!canReview}
          onClick={onReview}
        >
          Review &amp; Sign Off
        </button>
      </div>
    </div>
  );
}
