import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  capturedItems,
  findProject,
  itemStatusLabel,
  sectionCaptured,
  sectionNeedsAttention,
  totalItems,
} from "../data";
import StatusIcon from "../components/StatusIcon";
import ProjectHeader from "../components/ProjectHeader";
import { IconChevron, IconChevronRight } from "../components/Icon";

export default function Checklist() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? findProject(projectId) : undefined;
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  if (!project) {
    return (
      <main className="page">
        <p style={{ marginTop: 40 }}>
          Project not found. <Link to="/">Back to projects</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="page">
      <nav className="breadcrumb">
        <Link to="/" className="crumb crumb-back">
          <IconChevronRight className="crumb-back-icon" />
          All projects
        </Link>
      </nav>

      <ProjectHeader
        name={project.name}
        address={project.address}
        completed={capturedItems(project)}
        total={totalItems(project)}
      />

      <div className="sections">
        {project.sections.map((section) => {
          const done = sectionCaptured(section);
          const needsAttention = sectionNeedsAttention(section);
          const isCollapsed = collapsed[section.id];
          return (
            <div
              key={section.id}
              className={`section${isCollapsed ? " collapsed" : ""}`}
            >
              <button
                type="button"
                className="section-head"
                onClick={() => toggle(section.id)}
                aria-expanded={!isCollapsed}
              >
                <span className="section-head-left">
                  <IconChevron className="section-chevron" />
                  <span className="section-title">{section.title}</span>
                  {needsAttention && (
                    <span className="section-badge">Needs attention</span>
                  )}
                </span>
                <span className="section-count">
                  {done} of {section.items.length}
                </span>
              </button>

              <div className="section-items">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    className="item-row"
                    to={`/project/${project.id}/item/${item.id}`}
                  >
                    <StatusIcon status={item.status} />
                    <span className="item-text">
                      <span className="item-title">{item.title}</span>
                      <span className={`item-sub item-sub--${item.status}`}>
                        {itemStatusLabel(item)}
                      </span>
                    </span>
                    <IconChevronRight className="item-caret" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
