import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Projects from "./pages/Projects";
import Checklist from "./pages/Checklist";
import ItemDetail from "./pages/ItemDetail";

// Route depth → drives slide direction. Deeper = forward (slide in from right);
// shallower = back (slide in from left, the mirror of forward).
function routeDepth(pathname: string): number {
  if (pathname.includes("/item/")) return 2;
  if (pathname.startsWith("/project/")) return 1;
  return 0;
}

const DISTANCE = 24; // px of horizontal travel — small, so motion stays fast.

// Variants resolve `enter`/`exit` against the current `custom` (direction) at
// the moment each runs. Passing direction through AnimatePresence's `custom`
// means the back navigation is the exact mirror of forward: the outgoing page
// leaves the same way the incoming one would arrive on a forward move.
const pageVariants: Variants = {
  initial: (dir: number) => ({ opacity: 0, x: dir * DISTANCE }),
  enter: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -DISTANCE }),
};

export default function AnimatedRoutes() {
  const location = useLocation();
  const depth = routeDepth(location.pathname);

  // Compare against the previous depth to know which way we're moving.
  // NOTE: do NOT mutate the ref during render — under StrictMode the render
  // runs twice, which would clobber the comparison and force direction to 1
  // every time. Commit the new depth in an effect, after render.
  const prevDepth = useRef(depth);
  const direction = depth >= prevDepth.current ? 1 : -1; // 1 forward, -1 back

  useEffect(() => {
    prevDepth.current = depth;
  }, [depth]);

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
