import { mockTracks } from "../mock/mockTracks";

export default function Convert() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Convert to YouTube</h1>
      <p>Select YouTube account and confirm</p>
      <ul className="mt-4">
        {mockTracks.map(track => (
          <li key={track.id} className="border-b py-2">
            {track.title} - {track.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}
