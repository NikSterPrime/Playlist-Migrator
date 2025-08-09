import PlaylistCard from "../components/PlaylistCard";
import { mockPlaylists } from "../mock/mockPlaylists";

export default function Playlists() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Spotify Playlists</h1>
      <div className="grid grid-cols-2 gap-4">
        {mockPlaylists.map(p => (
          <PlaylistCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
