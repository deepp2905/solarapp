import { Link } from "react-router-dom";
import {
  capturedItems,
  totalItems,
  type Project,
  type ProjectStatus,
} from "../data";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  complete: "Complete",
};

export default function ProjectCard({ project }: { project: Project }) {
  const done = capturedItems(project);
  const total = totalItems(project);
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <Link to={`/project/${project.id}`} className="project-card">
      <div className="project-card-head">
        <div className="project-card-info">
          <div className="project-card-name">{project.name}</div>
          <div className="project-card-address">{project.address}</div>
          <div className="project-card-tags">
            <span className="tag">{project.type}</span>
            <span className="project-card-ahj">{project.ahj}</span>
          </div>
        </div>

        <span className="status-chip">
          <span className="status-dot" />
          {STATUS_LABEL[project.status]}
        </span>
      </div>

      <div className="project-card-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-count">
          {done}/{total}
        </span>
      </div>
    </Link>
  );
}
