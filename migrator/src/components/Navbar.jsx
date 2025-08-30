import React from "react";
import { Link } from "react-router-dom";

function Navbar() {

    return (
        <nav className="p-6 bg-[#000] text-white">
            <div className="flex justify-center items-center">
                <div className="flex-1">
                    <h1 className="font-bold">Playlist Migrator</h1>
                </div>
                <div className="space-x-4">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/spotifyplaylists" className="hover:underline">Spotify Playlists</Link>
                    <Link to="/youtubeplaylists" className="hover:underline">YouTube Playlists</Link>
                </div>
            </div>    
        </nav>
    )
};

export default Navbar;