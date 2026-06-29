import { useMemo, useState } from "react";
import { PROJECTS, PROJECT_STATUS_ORDER } from "../data";
import ProjectsHeader from "../components/ProjectsHeader";
import ProjectFilters from "../components/ProjectFilters";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [query, setQuery] = useState("");
  const [ahj, setAhj] = useState("all");

  const jurisdictions = useMemo(
    () => [...new Set(PROJECTS.map((p) => p.ahj))].sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      const matchesAhj = ahj === "all" || p.ahj === ahj;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.ahj.toLowerCase().includes(q);
      return matchesAhj && matchesQuery;
    }).sort(
      (a, b) =>
        PROJECT_STATUS_ORDER[a.status] - PROJECT_STATUS_ORDER[b.status]
    );
  }, [query, ahj]);

  return (
    <main className="page">
      <ProjectsHeader projects={PROJECTS} />

      <ProjectFilters
        query={query}
        onQueryChange={setQuery}
        ahj={ahj}
        onAhjChange={setAhj}
        jurisdictions={jurisdictions}
      />

      {filtered.length > 0 ? (
        <div className="projects-grid">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="projects-empty">No projects match your filters.</p>
      )}
    </main>
  );
}
