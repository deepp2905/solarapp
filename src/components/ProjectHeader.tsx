interface Props {
  name: string;
  address: string;
  completed: number;
  total: number;
  /** enabled once every item is captured */
  onReview?: () => void;
}

/** Project header card: name, address, then progress + Review action. */
export default function ProjectHeader({
  name,
  address,
  completed,
  total,
  onReview,
}: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const canReview = completed === total;

  return (
    <section className="project-header">
      <div className="project-header-info">
        <h1 className="project-name">{name}</h1>
        <p className="project-address">{address}</p>
      </div>

      <div className="project-header-row">
        <div className="project-header-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="project-header-pct">{pct}%</span>
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
    </section>
  );
}
