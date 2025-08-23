import { Link } from "react-router-dom";

export default function Home() {

  const API_BASE = "http://127.0.0.1:5050";
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Spotify → YouTube Playlist Converter</h1>
      <p className="mb-6">Login with Spotify to get started</p>
      <a
        href={`${API_BASE}/auth/spotify/login`}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Login with Spotify
      </a>
    </div>
  );
}
