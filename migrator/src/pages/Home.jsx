import { Link } from "react-router-dom";

export default function Home() {

  const API_BASE = "http://127.0.0.1:5050";
  return (
    <div className="">
      <h1 className="">Spotify → YouTube Playlist Converter</h1>
      <p className="">Login with Spotify to get started</p>
      <a
        href={`${API_BASE}/auth/spotify/login`}
        className=""
      >
        Login with Spotify
      </a>
    </div>
  );
}
