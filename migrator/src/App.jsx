import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import Convert from "./pages/Convert";
import Results from "./pages/Results";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="bg-[#000] pt-6 min-h-screen text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}
