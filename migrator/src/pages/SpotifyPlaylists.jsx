import { useEffect } from "react";
import PlaylistCard from "../components/PlaylistCard";
import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  
  const functioncallback = (playlistId,playlistName) => {
    togglePopup();
    handleViewTracks(playlistId,playlistName);
  };
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
  console.log(tracks);

  async function searchSong(query) {
  const res = await fetch(`http://127.0.0.1:5050/youtube/search?query=${encodeURIComponent(query)}`, {
    credentials: "include" // VERY important: sends cookies
  });
  const data = await res.json();
  console.log("YouTube search results:", data);
}

// Example usage:
searchSong("Shape of You");


  return (
    <div>
      <h1>Your Spotify Playlist</h1>
        <div>
          {playlists.map((pl) => (
            <div>
                <ul style={{listStyleType: "none"}}>
                  <li key={pl.id}>
                    <button onClick={() => functioncallback(pl.id,pl.name)}>
                      <img src = {pl.images?.url} alt = {pl.name}/>
                      <h2>{pl.name}</h2>
                    </button>
                  </li>
                  {isOpen && selectedPlaylist === pl.name && (
                    <div className="popup">
                      <div className="popup-inner">
                        <h2>Tracks in {selectedPlaylist}</h2>
                        <div>
                          {tracks.map((track) => (
                            <div key={track.id}>
                              <p>{track.name} - {track.artists}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </ul>
            </div>
          ))
        }
        </div>
    </div>
  );
};

export default Playlists;
