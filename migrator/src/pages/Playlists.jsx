import { useEffect } from "react";
import PlaylistCard from "../components/PlaylistCard";
import { useState } from "react";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async() => {
      try {
          const res = await fetch("http://127.0.0.1:5050/spotify/playlists", {
          method:"GET",  
          credentials:"include",
          });
          if (!res.ok) {
            throw new Error("Failed to fetch playlists");   
          }
          const data = await res.json();
          setPlaylists(data.items);
    } catch(err)
    {
      setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  fetchPlaylists();
}, []);

  if(loading) return <p>Loading Playlist...</p>
  if(error) return <p>Error: {error}</p>

  return (
     <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Spotify Playlists</h2>
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {playlists.map((pl) => (
          <li key={pl.id} className="p-4 shadow rounded bg-gray-100">
            <img
              src={pl.images?.[0]?.url}
              alt={pl.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <p className="font-semibold">{pl.name}</p>
            <p className="text-sm text-gray-600">{pl.tracks.total} tracks</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
