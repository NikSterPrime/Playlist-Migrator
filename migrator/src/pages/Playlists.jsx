import { useEffect } from "react";
import PlaylistCard from "../components/PlaylistCard";
import { useState } from "react";
import axios from "axios";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5050/spotify/playlists", {withCredentials: true })
      .then((res) => setPlaylists(res.data.items))
      .catch((err) => console.error(err.message))
  },[]);

  const handleViewTracks = (playlistId,playlistName) => {
    setSelectedPlaylist(playlistName);
    axios
      .get(`http://127.0.0.1:5050/spotify/playlist/${playlistId}/tracks`, {withCredentials: true })
      .then(res => setTracks(res.data.tracks))
      .catch(err => console.error(err.message));
  };

  return (
     <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Spotify Playlists</h1>

      {/* Playlists */}
      <ul className="space-y-3">
        {playlists.map((pl) => (
          <li
            key={pl.id}
            className="p-3 border rounded-lg shadow flex items-center justify-between"
          >
            <span className="font-medium">{pl.name}</span>
            <button
              onClick={() => handleViewTracks(pl.id, pl.name)}
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              View Tracks
            </button>
          </li>
        ))}
      </ul>

      {/* Tracks */}
      {selectedPlaylist && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3">
            Tracks in "{selectedPlaylist}"
          </h2>
          {tracks && tracks.length > 0 ? (
            <ul className="space-y-2">
              {tracks.map((track) => (
                <li
                  key={track.id}
                  className="p-2 border-b flex justify-between items-center"
                >
                  <span>
                    🎵 {track.name} — {track.artists}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tracks found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Playlists;
