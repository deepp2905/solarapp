import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deriveItemStatus, findItem, type Evidence } from "../data";
import { useProject, useProjects } from "../store";
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
  const project = useProject(projectId);
  const { setItemEvidence } = useProjects();
  const found = project && itemId ? findItem(project, itemId) : null;

  // local copy so override / delete can mutate without a backend.
  // `uid` lets us track which freshly added tiles should show the loader.
  type LocalEvidence = Evidence & { uid: number };
  const uidRef = useRef(0);
  const [evidence, setEvidenceState] = useState<LocalEvidence[]>(() =>
    (found?.item.evidence ?? []).map((e) => ({ ...e, uid: uidRef.current++ }))
  );
  const [loadingUids, setLoadingUids] = useState<Set<number>>(new Set());

  // Wraps the local state setter so every evidence change is also pushed to the
  // shared store (stripping the local-only `uid`), keeping the checklist and
  // project cards in sync with edits made here.
  function setEvidence(
    update: (list: LocalEvidence[]) => LocalEvidence[]
  ) {
    setEvidenceState((list) => {
      const next = update(list);
      if (projectId && itemId) {
        const stripped = next.map(({ uid: _uid, ...rest }) => rest);
        // Defer the store write so it doesn't run inside the reducer (which
        // StrictMode invokes twice) — schedule it after this commit.
        queueMicrotask(() => setItemEvidence(projectId, itemId, stripped));
      }
      return next;
    });
  }

  // Hidden inputs: one for library/browse, one that prefers the camera.
  const browseInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const added: LocalEvidence[] = Array.from(fileList).map((file) => ({
      uid: uidRef.current++,
      fileName: file.name,
      displayName: file.name,
      ready: true,
      // Manually added files don't run the on-site GPS check in this prototype.
      gps: "ok",
      thumbnailUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));
    setEvidence((list) => [...list, ...added]);
    setLoadingUids((s) => {
      const next = new Set(s);
      added.forEach((e) => next.add(e.uid));
      return next;
    });
  }

  function clearLoading(uid: number) {
    setLoadingUids((s) => {
      if (!s.has(uid)) return s;
      const next = new Set(s);
      next.delete(uid);
      return next;
    });
  }

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
  // Live status derived from the local evidence (see deriveItemStatus rules):
  // any GPS failure without a saved reason → "error" (GPS Failed!).
  const liveStatus = deriveItemStatus(evidence);
  // Show the override form whenever a GPS failure exists at all (resolved or
  // not) so the saved reason stays editable; the "GPS Failed!" pill, however,
  // only shows while the failure is unresolved.
  const hasGpsFailure = evidence.some((e) => e.gps === "failed");
  const showGpsFailedPill = liveStatus === "error";

  return (
    <main className="page detail-page">
      <Link to={checklistPath} className="crumb-back">
        <IconChevronRight className="crumb-back-icon" />
        Back to Checklist
      </Link>

      <header className="detail-heading">
        <div className="detail-title-row">
          <h1 className="detail-title">{item.title}</h1>
          {showGpsFailedPill && (
            <span className="pill pill-error-soft">GPS Failed</span>
          )}
        </div>
        <p className="detail-subtitle">{item.subtitle}</p>
      </header>

      <div
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
      >
        {/* Hidden file inputs driven by the buttons below */}
        <input
          ref={browseInputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {/* Desktop: drag-and-drop + browse */}
        <span className="dropzone-icon dropzone-desktop">
          <IconUpload className="icon-26" />
        </span>
        <div className="dropzone-text dropzone-desktop">
          <p className="dropzone-title">Drag photos &amp; PDFs here</p>
          <p className="dropzone-sub">Drop several at once or browse to upload.</p>
        </div>
        <button
          type="button"
          className="btn-browse dropzone-desktop"
          onClick={() => browseInputRef.current?.click()}
        >
          Browse files
        </button>

        {/* Mobile: capture or pick from gallery */}
        <div className="dropzone-mobile">
          <p className="dropzone-title">Add a photo</p>
          <p className="dropzone-sub">Take a picture or upload from your gallery.</p>
          <div className="dropzone-cta-row">
            <button
              type="button"
              className="btn btn-take dropzone-cta"
              onClick={() => cameraInputRef.current?.click()}
            >
              <IconCamera className="icon-16" /> Take a picture
            </button>
            <button
              type="button"
              className="btn-browse dropzone-cta"
              onClick={() => browseInputRef.current?.click()}
            >
              <IconImage className="icon-16" /> Upload files
            </button>
          </div>
        </div>

        <p className="dropzone-hint">PDF, JPG, PNG · up to 25MB</p>
      </div>

      {evidence.length > 0 && (
        <div className="evidence-grid">
          {evidence.map((ev) => (
            <EvidenceCard
              key={ev.uid}
              evidence={ev}
              loading={loadingUids.has(ev.uid)}
              onLoaded={() => clearLoading(ev.uid)}
              onDelete={() =>
                setEvidence((list) => list.filter((e) => e.uid !== ev.uid))
              }
            />
          ))}
        </div>
      )}

      {hasGpsFailure && (
        <OverrideForm
          initialNote={
            evidence.find((e) => e.gps === "failed" && e.overrideNote)
              ?.overrideNote ?? ""
          }
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
