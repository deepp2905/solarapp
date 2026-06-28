import {
  PROJECT_STATUS_LABEL,
  projectStatusCounts,
  type Project,
} from "../data";
import { IconPlus } from "./Icon";

interface Props {
  projects: Project[];
  onAddProject?: () => void;
}

export default function ProjectsHeader({ projects, onAddProject }: Props) {
  const counts = projectStatusCounts(projects);

  return (
    <header className="projects-header">
      <div className="projects-heading">
        <h1 className="page-title">Projects</h1>
        <div className="projects-summary">
          {counts.map(({ status, count }, i) => (
            <span key={status} className="projects-summary-item">
              {i > 0 && <span className="projects-summary-sep">•</span>}
              {count} {PROJECT_STATUS_LABEL[status]}
            </span>
          ))}
        </div>
      </div>

      <div className="projects-actions">
        <button type="button" className="btn-solid btn-add" onClick={onAddProject}>
          <IconPlus className="icon-18" />
          Add project
        </button>
        <p className="projects-import">
          Import by SolarAPP+ ID?{" "}
          <a href="#" className="projects-import-link">
            Connect your integration
          </a>
        </p>
      </div>
    </header>
  );
}
