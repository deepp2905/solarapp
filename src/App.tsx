import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Projects from "./pages/Projects";
import Checklist from "./pages/Checklist";
import ItemDetail from "./pages/ItemDetail";

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/project/:projectId" element={<Checklist />} />
          <Route
            path="/project/:projectId/item/:itemId"
            element={<ItemDetail />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
