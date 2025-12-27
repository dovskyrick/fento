import { Routes, Route } from "react-router-dom";
import Exterior from "./pages/Exterior";
import Engine from "./pages/Engine";
import Studio from "./pages/Studio";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Exterior />} />
      <Route path="/engineering-cv" element={<Engine />} />
      <Route path="/art-portfolio" element={<Studio />} />
    </Routes>
  );
}
