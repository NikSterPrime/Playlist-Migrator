import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Playlists from "./pages/SpotifyPlaylists";
import YtPlaylists from "./pages/YouTubeSearch";
import Convert from "./pages/Convert";
import Results from "./pages/Results";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-6 min-h-screen text-white" style={{background:"linear-gradient(to bottom,#121212,#0f0f0f ,#32285C)"}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spotifyplaylists" element={<Playlists />} />
          <Route path="/youtubeplaylists" element={<YtPlaylists />} />
        </Routes>
      </div>
    </Router>
  );
}
