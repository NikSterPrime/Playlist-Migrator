const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔑 SCOPES
const scopes = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
].join(" ");

// 🔑 Login with Spotify
router.get("/login", (req, res) => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
  res.redirect(authUrl);
});

// 🔑 Callback
router.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token } = response.data;

    res.cookie("spotify_access_token", access_token, { httpOnly: true });
    res.cookie("spotify_refresh_token", refresh_token, { httpOnly: true });

    res.redirect("http://127.0.0.1:5173/playlists");
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send("Error during authentication");
  }
});

// 🔄 Refresh token
router.get("/refresh", async (req, res) => {
  const refreshToken = req.cookies.spotify_refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token available" });
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = response.data;
    res.cookie("spotify_access_token", access_token, { httpOnly: true });
    res.json({ access_token });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});

// 🎵 Get user playlists
router.get("/playlists", async (req, res) => {
  const token = req.cookies.spotify_access_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Spotify error:", err);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// 🎶 Get tracks in a playlist
router.get("/playlist/:id/tracks", async (req, res) => {
  const token = req.cookies.spotify_access_token;
  const playlistId = req.params.id;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const tracks = response.data.items.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((a) => a.name).join(", "),
    }));

    res.json({ tracks });
  } catch (err) {
    console.error("Error fetching playlist tracks:", err);
    res.status(500).json({ error: "Failed to fetch playlist tracks" });
  }
});

module.exports = router;
