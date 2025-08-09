export default function PlaylistCard({ name, image, tracks }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <img src={image} alt={name} className="rounded-md mb-2" />
      <h2 className="font-semibold">{name}</h2>
      <p className="text-gray-500">{tracks} tracks</p>
    </div>
  );
}
