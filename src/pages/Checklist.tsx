import { useState } from "react";
import { Link } from "react-router-dom";
import { CAPTURED_ITEMS, PROJECT, SECTIONS, TOTAL_ITEMS } from "../data";
import StatusIcon from "../components/StatusIcon";
import ProjectHeader from "../components/ProjectHeader";
import { IconChevron } from "../components/Icon";

export default function Checklist() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  return (
    <main className="page">
      <ProjectHeader
        name={PROJECT.name}
        address={PROJECT.address}
        completed={CAPTURED_ITEMS}
        total={TOTAL_ITEMS}
      />

      <div className="sections">
          {SECTIONS.map((section) => {
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
                    to={`/item/${item.id}`}
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
