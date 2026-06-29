import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { findItem, findProject, type Evidence } from "../data";
import EvidenceCard from "../components/EvidenceCard";
import OverrideForm from "../components/OverrideForm";
import {
  IconCamera,
  IconChevronRight,
  IconImage,
  IconUpload,
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
  const checklistPath = `/project/${project.id}`;
  const hasGpsFailure = evidence.some((e) => e.gps === "failed");

  return (
    <main className="page detail-page">
      <Link to={checklistPath} className="crumb-back">
        <IconChevronRight className="crumb-back-icon" />
        Back to Checklist
      </Link>

      <header className="detail-heading">
        <div className="detail-title-row">
          <h1 className="detail-title">{item.title}</h1>
          {item.status === "error" && (
            <span className="pill pill-error-soft">GPS Failed</span>
          )}
        </div>
        <p className="detail-subtitle">{item.subtitle}</p>
      </header>

      <div className="dropzone">
        {/* Desktop: drag-and-drop + browse */}
        <span className="dropzone-icon dropzone-desktop">
          <IconUpload className="icon-26" />
        </span>
        <div className="dropzone-text dropzone-desktop">
          <p className="dropzone-title">Drag photos &amp; PDFs here</p>
          <p className="dropzone-sub">Drop several at once or browse to upload.</p>
        </div>
        <button type="button" className="btn-browse dropzone-desktop">
          Browse files
        </button>

        {/* Mobile: capture or pick from gallery */}
        <div className="dropzone-mobile">
          <p className="dropzone-title">Add a photo</p>
          <p className="dropzone-sub">Take a picture or upload from your gallery.</p>
          <div className="dropzone-cta-row">
            <button type="button" className="btn btn-take">
              <IconCamera className="icon-16" /> Take a picture
            </button>
            <button type="button" className="btn-browse">
              <IconImage className="icon-16" /> Upload from gallery
            </button>
          </div>
        </div>

        <p className="dropzone-hint">PDF, JPG, PNG · up to 25MB</p>
      </div>

      {evidence.length > 0 && (
        <div className="evidence-grid">
          {evidence.map((ev, i) => (
            <EvidenceCard
              key={ev.fileName + i}
              evidence={ev}
              onDelete={() =>
                setEvidence((list) => list.filter((_, j) => j !== i))
              }
            />
          ))}
        </div>
      )}

      {hasGpsFailure && (
        <OverrideForm
          onSave={(note) =>
            setEvidence((list) =>
              list.map((e) =>
                e.gps === "failed" ? { ...e, overrideNote: note } : e
              )
            )
          }
        />
      )}
    </main>
  );
}
