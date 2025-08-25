import React from "react";
import { Link } from "react-router-dom";

function Navbar() {

    return (
        <nav className="p-6 bg-[#1DB954] text-white mb-6">
            <div className="flex justify-center items-center">
                <div className="flex-1">
                    <h1 className="font-bold">Playlist Migrator</h1>
                </div>
                <div className="space-x-4">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/playlists">Playlists</Link>
                    <Link to="/convert">Convert</Link>
                    <Link to="/results">Results</Link>
                </div>
            </div>    
        </nav>
    )
};

export default Navbar;