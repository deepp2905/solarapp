import { Link, useParams } from "react-router-dom";
import { findItem, project, sections, totalItems } from "../data";
import { ArrowLeft, ArrowRight, Camera, ImageIcon, Pin } from "../icons";

// flat ordered list of items for prev/next navigation
const flat = sections.flatMap((s) => s.items);

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const found = id ? findItem(id) : null;

  if (!found) {
    return (
      <div className="page">
        <p style={{ marginTop: 40 }}>
          Item not found. <Link to="/">Back to checklist</Link>
        </p>
      </div>
    );
  }

  const { item } = found;
  const index = flat.findIndex((i) => i.id === item.id);
  const prev = flat[index - 1];
  const next = flat[index + 1];

  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/">{project.name}</Link>
        <span className="sep">›</span>
        <Link to="/">Checklist</Link>
        <span className="sep">›</span>
        <span className="current">{item.title}</span>
      </nav>

      <div className="detail-progress">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((index + 1) / totalItems) * 100}%` }}
          />
        </div>
        <span className="progress-count">
          {index + 1}/{totalItems}
          <span>
            {index + 1} of {totalItems} items
          </span>
        </span>
      </div>

      <h1 className="detail-title">{item.title}</h1>
      <p className="detail-subtitle">{item.subtitle}</p>

      <div className="dropzone">
        <div className="dropzone-actions">
          <button className="btn btn-primary">
            <Camera /> Take Photo
          </button>
          <button className="btn btn-secondary">
            <ImageIcon /> Choose from Library
          </button>
        </div>
        <p className="dropzone-hint">
          …or drag photos here — you can drop several at once.
        </p>
      </div>

      <p className="location-note">
        <Pin /> Your browser will ask for location access so we can confirm the
        photo was taken on-site.
      </p>

      <div className="evidence-box">No evidence captured yet.</div>

      <a className="not-applicable" href="#">
        This item doesn't apply to my install
      </a>

      <div className="detail-nav">
        {prev ? (
          <Link to={`/item/${prev.id}`} className="muted">
            <ArrowLeft /> {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/item/${next.id}`} className="next">
            {next.title} <ArrowRight />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
