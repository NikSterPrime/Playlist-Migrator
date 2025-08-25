import { mockTracks } from "../mock/mockTracks";

export default function Convert() {
  return (
    <div>
      <h1 className="">Convert to YouTube</h1>
      <p>Select YouTube account and confirm</p>
      <ul className="">
        {mockTracks.map(track => (
          <li key={track.id} className="">
            {track.title} - {track.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}
