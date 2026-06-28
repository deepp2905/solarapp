import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  capturedItems,
  findItem,
  findProject,
  flatItems,
  type Evidence,
} from "../data";
import EvidenceCard from "../components/EvidenceCard";
import {
  IconArrowRight,
  IconChevronRight,
  IconImage,
} from "../components/Icon";

export default function ItemDetail() {
  const { projectId, itemId } = useParams<{
    projectId: string;
    itemId: string;
  }>();
  const project = projectId ? findProject(projectId) : undefined;
  const found = project && itemId ? findItem(project, itemId) : null;

  // local copy so override / delete can mutate without a backend
  const [evidence, setEvidence] = useState<Evidence[]>(
    found?.item.evidence ?? []
  );

  if (!project || !found) {
    return (
      <main className="page">
        <p style={{ marginTop: 40 }}>
          Item not found. <Link to="/">Back to projects</Link>
        </p>
      </main>
    );
  }

  const { item } = found;
  const items = flatItems(project);
  const total = items.length;
  const completed = capturedItems(project);
  const index = items.findIndex((i) => i.id === item.id);
  const prev = items[index - 1];
  const next = items[index + 1];
  const checklistPath = `/project/${project.id}`;

  return (
    <main className="page">
      <nav className="breadcrumb">
        <Link to={checklistPath} className="crumb">
          {project.name}
        </Link>
        <IconChevronRight className="crumb-sep" />
        <Link to={checklistPath} className="crumb">
          Checklist
        </Link>
        <IconChevronRight className="crumb-sep" />
        <span className="crumb current">{item.title}</span>
      </nav>

      <div className="detail-progress">
        <div className="progress-wrap detail-progress-bar">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
          <span className="progress-count">
            {completed}/{total}
          </span>
        </div>
        <span className="detail-progress-label">
          {completed} of {total} items
        </span>
      </div>

      <div className="detail-heading">
        <h1 className="detail-title">{item.title}</h1>
        <p className="detail-subtitle">{item.subtitle}</p>
      </div>

      <div className="dropzone">
        <div className="dropzone-actions">
          <button className="btn btn-take">
            <IconImage className="icon-16" /> Take Photo
          </button>
          <button className="btn btn-library">
            <IconImage className="icon-16" /> Choose from Library
          </button>
        </div>
        <p className="dropzone-hint">
          …or drag photos, videos here — you can drop several at once.
        </p>
      </div>

      {evidence.length > 0 ? (
        <div className="evidence-list">
          {evidence.map((ev, i) => (
            <EvidenceCard
              key={ev.fileName + i}
              evidence={ev}
              gpsToleranceMi={project.gpsToleranceMi}
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

      <div className="detail-nav">
        {prev ? (
          <Link to={`${checklistPath}/item/${prev.id}`} className="detail-nav-link prev">
            <IconChevronRight className="icon-16 flip" />
            <span className="detail-nav-title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`${checklistPath}/item/${next.id}`} className="detail-nav-link next">
            <span className="detail-nav-title">{next.title}</span>
            <IconArrowRight className="icon-16" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
