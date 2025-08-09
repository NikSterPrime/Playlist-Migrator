import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Spotify → YouTube Playlist Converter</h1>
      <p className="mb-6">Login with Spotify to get started</p>
      <Link
        to="/playlists"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Login with Spotify
      </Link>
    </div>
  );
}
