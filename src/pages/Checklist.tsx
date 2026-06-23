import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sections,
  project,
  totalItems,
  capturedItems,
} from "../data";
import { CheckCircle, Chevron } from "../icons";

export default function Checklist() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((s) => [s.id, true]))
  );

  const toggle = (id: string) =>
    setOpen((o) => ({ ...o, [id]: !o[id] }));

  return (
    <>
      <div className="checklist-header">
        <div className="checklist-header-inner">
          <h1 className="project-title">{project.name}</h1>
          <p className="project-address">{project.address}</p>

          <div className="header-row">
            <div className="progress-wrap">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${(capturedItems / totalItems) * 100}%` }}
                />
              </div>
              <span className="progress-count">
                {capturedItems}/{totalItems}
              </span>
            </div>
            <button className="review-btn">Review &amp; Sign Off</button>
          </div>
        </div>
      </div>

      <div className="page">
        <div className="sections">
          {sections.map((section) => {
            const done = section.items.filter(
              (i) => i.status === "captured"
            ).length;
            const isOpen = open[section.id];
            return (
              <div className="section" key={section.id}>
                <button
                  className="section-head"
                  onClick={() => toggle(section.id)}
                >
                  <span className="section-title">{section.title}</span>
                  <span className="section-meta">
                    {done} of {section.items.length} complete
                    <Chevron open={isOpen} />
                  </span>
                </button>

                {isOpen &&
                  section.items.map((item) => (
                    <button
                      className="item-row"
                      key={item.id}
                      onClick={() => navigate(`/item/${item.id}`)}
                    >
                      <span className="item-left">
                        {item.status === "captured" ? (
                          <CheckCircle />
                        ) : (
                          <span className="status-icon">
                            <span className="dot" />
                          </span>
                        )}
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
                      ) : (
                        <span className="badge">To capture</span>
                      )}
                    </button>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
