import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { capturedItems, findProject, totalItems } from "../data";
import StatusIcon from "../components/StatusIcon";
import ProjectHeader from "../components/ProjectHeader";
import { IconChevron } from "../components/Icon";

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
      <ProjectHeader
        name={project.name}
        address={project.address}
        completed={capturedItems(project)}
        total={totalItems(project)}
      />

      <div className="sections">
        {project.sections.map((section) => {
          const done = section.items.filter(
            (i) => i.status === "captured"
          ).length;
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
              >
                <span className="section-title">{section.title}</span>
                <span className="section-meta">
                  {done} of {section.items.length} complete
                  <IconChevron className="chevron" />
                </span>
              </button>

              {section.items.map((item) => (
                <Link
                  key={item.id}
                  className="item-row"
                  to={`/project/${project.id}/item/${item.id}`}
                >
                  <span className="item-left">
                    <StatusIcon status={item.status} />
                    <span>
                      <span className="item-title">{item.title}</span>
                      {item.status === "captured" && (
                        <div className="item-files">
                          {item.filesCaptured} files captured
                        </div>
                      )}
                    </span>
                  </span>

                  {item.status === "captured" ? (
                    <span className="thumb">IMG</span>
                  ) : item.status === "error" ? (
                    <span className="badge badge-error">GPS failed</span>
                  ) : (
                    <span className="badge">To capture</span>
                  )}
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </main>
  );
}
