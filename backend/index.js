const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({ origin: 'http://127.0.0.1:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req,res) => {
    res.send("Spotify Backend is running tick");
});

const scopes = [
    "playlist-read-private",
    "playlist-read-collaborative",
].join(" ");

app.get("/auth/spotify/login", (req,res) => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
    res.redirect(authUrl);
})

app.get("/auth/spotify/callback", async(req,res) => {
    const code = req.query.code || null;
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }).toString(), 
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
);

const { access_token, refresh_token, expires_in } = response.data;

res.cookie('spotify_access_token', access_token, { httpOnly: true});
res.cookie('spotify_refresh_token', refresh_token, { httpOnly: true});

res.redirect('http://127.0.0.1:5173/playlists');
} catch (error) {
    console.error(error.response?.data || error.message);
    res.send("Error during authentication");
}
});

app.get("/spotify/playlists",async(req,res)=> {
    const token = req.cookies.spotify_access_token;
    if(!token) return res.status(401).json({error:"Not authenticated"});
    try {
        const response = await axios.get("https://api.spotify.com/v1/me/playlists",{
            headers:{Authorization:`Bearer ${token}`}
        });
        res.json(response.data);
    }catch(error){
        console.error(error.response?.data || error.message);
        res.status(500).json({error:"Failed to fetch playlists"});
    }
});

app.listen(PORT,() => console.log(`Server running on port ${PORT}`));