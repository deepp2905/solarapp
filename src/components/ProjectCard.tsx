import { Link } from "react-router-dom";
import { capturedItems, totalItems, type Project } from "../data";
import StatusBadge from "./StatusBadge";

export default function ProjectCard({ project }: { project: Project }) {
  const done = capturedItems(project);
  const total = totalItems(project);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Link to={`/project/${project.id}`} className="project-card">
      <div className="project-card-top">
        <StatusBadge status={project.status} />
        <span className="type-chip">{project.type}</span>
      </div>

      <div className="project-card-body">
        <h3 className="project-card-name">{project.name}</h3>
        <p className="project-card-address">{project.address}</p>
      </div>

      <div className="project-card-progress">
        <span className="project-card-count">
          {done} / {total}
        </span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="project-card-pct">{pct}%</span>
      </div>
    </Link>
  );
}
