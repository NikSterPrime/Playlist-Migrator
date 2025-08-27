import React, { useState } from "react";
import axios from "axios";

const YouTubeSearch = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");

  const searchSong = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5050/youtube/search", {
        params: { query },
        withCredentials: true,
      });

      // Backend only returns a single { videoId, title }
      // Wrap it in an array so map() works
      setResults([res.data]);  
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">YouTube Search</h1>

      {/* Input + Search Button */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Search a song..."
        />
        <button
          onClick={searchSong}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((video) => (
          <div key={video.videoId} className="p-4 border rounded shadow">
            <h2 className="font-semibold">{video.title}</h2>
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm"
            >
              Watch on YouTube
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeSearch;
