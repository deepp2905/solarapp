import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FLAT_ITEMS,
  PROJECT,
  TOTAL_ITEMS,
  findItem,
  type Evidence,
} from "../data";
import EvidenceCard from "../components/EvidenceCard";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCamera,
  IconImage,
  IconPin,
} from "../components/Icon";

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const found = id ? findItem(id) : null;

  // local copy so override / delete can mutate without a backend
  const [evidence, setEvidence] = useState<Evidence[]>(
    found?.item.evidence ?? []
  );

  if (!found) {
    return (
      <main className="page">
        <p style={{ marginTop: 40 }}>
          Item not found. <Link to="/">Back to checklist</Link>
        </p>
      </main>
    );
  }

  const { item } = found;
  const index = FLAT_ITEMS.findIndex((i) => i.id === item.id);
  const prev = FLAT_ITEMS[index - 1];
  const next = FLAT_ITEMS[index + 1];

  return (
    <main className="page">
      <nav className="breadcrumb">
        <Link to="/">{PROJECT.name}</Link>
        <span className="sep">›</span>
        <Link to="/">Checklist</Link>
        <span className="sep">›</span>
        <span className="current">{item.title}</span>
      </nav>

      <div className="detail-progress">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((index + 1) / TOTAL_ITEMS) * 100}%` }}
          />
        </div>
        <span className="progress-count">
          {index + 1}/{TOTAL_ITEMS}
          <span>
            {index + 1} of {TOTAL_ITEMS} items
          </span>
        </span>
      </div>

      <h1 className="detail-title">{item.title}</h1>
      <p className="detail-subtitle">{item.subtitle}</p>

      <div className="dropzone">
        <div className="dropzone-actions">
          <button className="btn btn-primary">
            <IconCamera className="icon-18" /> Take Photo
          </button>
          <button className="btn btn-secondary">
            <IconImage className="icon-18" /> Choose from Library
          </button>
        </div>
        <p className="dropzone-hint">
          …or drag photos here — you can drop several at once.
        </p>
      </div>

      <p className="location-note">
        <IconPin className="icon-14" />
        Your browser will ask for location access so we can confirm the photo
        was taken on-site.
      </p>

      {evidence.length > 0 ? (
        <div className="evidence-list">
          {evidence.map((ev, i) => (
            <EvidenceCard
              key={ev.fileName + i}
              evidence={ev}
              onDelete={() =>
                setEvidence((list) => list.filter((_, j) => j !== i))
              }
              onSaveOverride={(note) =>
                setEvidence((list) =>
                  list.map((e, j) =>
                    j === i ? { ...e, overrideNote: note } : e
                  )
                )
              }
            />
          ))}
        </div>
      ) : (
        <div className="evidence-box">No evidence captured yet.</div>
      )}

      <a className="not-applicable" href="#">
        This item doesn't apply to my install
      </a>

      <div className="detail-nav">
        {prev ? (
          <Link to={`/item/${prev.id}`} className="muted">
            <IconArrowLeft className="icon-16" /> {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/item/${next.id}`} className="next">
            {next.title} <IconArrowRight className="icon-16" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
