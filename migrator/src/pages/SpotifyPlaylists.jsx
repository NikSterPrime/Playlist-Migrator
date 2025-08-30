import { useEffect } from "react";
import PlaylistCard from "../components/PlaylistCard";
import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import RippleButton from "../components/RippleButton";

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

  const migratetoYoutube = async (playlists) => {
    try{
      const res = await axios.post("http://127.0.0.1:5050/migrate/spotifytoyoutube",{
        spotifyPlaylist: playlists,
        youtubePlaylistTitle: playlists.name
      },{withCredentials: true});
      alert(`Playlist migrated successfully:${res.data.youtubePlaylistId}`);
    }catch(err){
      console.error("Migration error:",err);
      alert("Migration failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Your Spotify Playlist</h1>
        <div className="flex flex-wrap justify-center items-center">
          {playlists.map((pl) => (
            <div className="bg-gray-800 m-1 p-5 rounded-4xl overflow max-w-80 max-h-90 justify-center items-center">
                <ul style={{listStyleType: "none"}}>
                  <li key={pl.id} className="p-6 m-5">
                    <button onClick={() => functioncallback(pl.id,pl.name)}>
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <img src = {pl.images?.[0]?.url} alt = {pl.name} className="w-40 h-40 object-cover rounded-3xl"/>
                        <h2 className=" font-semibold">{pl.name}</h2>
                      </div>
                    </button>
                    <button
                      onClick={() => migratetoYoutube(pl)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-white">
                      Migrate to YouTube
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
