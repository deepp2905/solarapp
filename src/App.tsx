import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Checklist from "./pages/Checklist";
import ItemDetail from "./pages/ItemDetail";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Checklist />} />
        <Route path="/item/:id" element={<ItemDetail />} />
      </Routes>
    </>
  );
}
