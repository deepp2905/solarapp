import { useState } from "react";
import { PROJECTS } from "../data";
import ProjectCard from "../components/ProjectCard";
import { IconChevron, IconSearch } from "../components/Icon";

export default function Projects() {
  const [query, setQuery] = useState("");

  const filtered = PROJECTS.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.ahj.toLowerCase().includes(q)
    );
  });

  return (
    <main className="page">
      <h1 className="page-title">Projects</h1>

      <div className="projects-toolbar">
        <span className="projects-count">
          {PROJECTS.length} project{PROJECTS.length === 1 ? "" : "s"}
        </span>
        <div className="projects-add">
          <button type="button" className="btn-solid">
            Add project
          </button>
          <span className="projects-import">
            Import by SolarAPP+ ID? Connect your integration
          </span>
        </div>
      </div>

      <div className="filters">
        <label className="field field-grow">
          <span className="field-label">Search</span>
          <span className="input-wrap">
            <IconSearch className="input-icon" />
            <input
              className="input"
              type="search"
              placeholder="Title, address, permit number, or SolarAPP ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </span>
        </label>

        <label className="field field-ahj">
          <span className="field-label">Jurisdiction (AHJ)</span>
          <span className="input-wrap">
            <select className="input select" defaultValue="all">
              <option value="all">All jurisdictions</option>
              {[...new Set(PROJECTS.map((p) => p.ahj))].map((ahj) => (
                <option key={ahj} value={ahj}>
                  {ahj}
                </option>
              ))}
            </select>
            <IconChevron className="input-icon input-icon-right select-caret" />
          </span>
        </label>
      </div>

      <div className="projects-list">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {filtered.length === 0 && (
          <p className="projects-empty">No projects match “{query}”.</p>
        )}
      </div>
    </main>
  );
}
