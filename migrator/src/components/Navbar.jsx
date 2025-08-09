import React from "react";
import { Link } from "react-router-dom";

function Navbar() {

    return (
        <nav className="p-5 text-[#4f4f4f] " style={{ backgroundColor:"#B5EAD7"}}>
            <div className="flex flex-row justify-between items-center max-w-5xl mx-auto">
                <h1 className="text-2xl">Playlist Migrator</h1>
                <div className="space-x-4">
                    <Link to="/">Home</Link>
                    <Link to="/playlists">Playlists</Link>
                    <Link to="/convert">Convert</Link>
                </div>
            </div>    
        </nav>
    )
};

export default Navbar;