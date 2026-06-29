import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { flatItems } from "./data";
import { useProjects } from "./store";
import Projects from "./pages/Projects";
import Checklist from "./pages/Checklist";
import ItemDetail from "./pages/ItemDetail";
import type { Project } from "./data";

const DISTANCE = 24; // px of horizontal travel — small, so motion stays fast.

// A monotonic "navigation rank" for a location: it grows as you move forward
// through the app. Levels are spaced far apart (×1000) so the within-checklist
// item index never overlaps the level boundary. Comparing two ranks then yields
// the slide direction uniformly — projects → checklist → item AND item → item.
function navRank(pathname: string, projects: Project[]): number {
  const itemMatch = pathname.match(/^\/project\/([^/]+)\/item\/([^/]+)/);
  if (itemMatch) {
    const [, projectId, itemId] = itemMatch;
    const project = projects.find((p) => p.id === projectId);
    const index = project
      ? flatItems(project).findIndex((i) => i.id === itemId)
      : -1;
    return 2000 + Math.max(index, 0);
  }
  if (pathname.startsWith("/project/")) return 1000;
  return 0;
}

const pageVariants: Variants = {
  initial: (dir: number) => ({ opacity: 0, x: dir * DISTANCE }),
  enter: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -DISTANCE }),
};

export default function AnimatedRoutes() {
  const location = useLocation();
  const { projects } = useProjects();
  const rank = navRank(location.pathname, projects);

  // Compare against the previous rank to know which way we're moving.
  // NOTE: don't mutate the ref during render — under StrictMode the render runs
  // twice, which would clobber the comparison. Commit it in an effect instead.
  const prevRank = useRef(rank);
  const direction = rank >= prevRank.current ? 1 : -1; // 1 forward, -1 back

  useEffect(() => {
    prevRank.current = rank;
  }, [rank]);

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Projects />} />
          <Route path="/project/:projectId" element={<Checklist />} />
          <Route
            path="/project/:projectId/item/:itemId"
            element={<ItemDetail />}
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
