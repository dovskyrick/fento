import { Routes, Route } from "react-router-dom";
import Exterior from "./pages/Exterior";
import Office from "./pages/Office";
import Studio from "./pages/Studio";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Exterior />} />
      <Route path="/engineering-portfolio" element={<Office />} />
      <Route path="/art-portfolio" element={<Studio />} />
    </Routes>
  );
}
