import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  PROJECTS as SEED_PROJECTS,
  deriveItemStatus,
  type Evidence,
  type Project,
} from "./data";

interface ProjectsContextValue {
  projects: Project[];
  /**
   * Replace an item's evidence and re-derive its status. Returns nothing;
   * components read the updated project tree from `projects`.
   */
  setItemEvidence: (
    projectId: string,
    itemId: string,
    evidence: Evidence[]
  ) => void;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

// Replace one item inside the project tree immutably, applying `update` to it.
function replaceItem(
  projects: Project[],
  projectId: string,
  itemId: string,
  evidence: Evidence[]
): Project[] {
  return projects.map((project) => {
    if (project.id !== projectId) return project;
    return {
      ...project,
      sections: project.sections.map((section) => {
        if (!section.items.some((i) => i.id === itemId)) return section;
        return {
          ...section,
          items: section.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  evidence,
                  filesCaptured: evidence.length,
                  status: deriveItemStatus(evidence),
                }
              : item
          ),
        };
      }),
    };
  });
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);

  const setItemEvidence = useCallback(
    (projectId: string, itemId: string, evidence: Evidence[]) => {
      setProjects((prev) => replaceItem(prev, projectId, itemId, evidence));
    },
    []
  );

  const value = useMemo(
    () => ({ projects, setItemEvidence }),
    [projects, setItemEvidence]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return ctx;
}

/** Look up a single project from the live store by id. */
export function useProject(id: string | undefined): Project | undefined {
  const { projects } = useProjects();
  return useMemo(
    () => (id ? projects.find((p) => p.id === id) : undefined),
    [projects, id]
  );
}
