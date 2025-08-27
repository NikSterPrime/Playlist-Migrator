const express = require("express");
const router = express.Router();
const axios = require("axios");

// Login with YouTube
router.get("/login", (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube.readonly"
  ];
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.YOUTUBE_CLIENT_ID}&redirect_uri=${process.env.YOUTUBE_REDIRECT_URI}&response_type=code&scope=${scopes.join(" ")}&access_type=offline`;

  res.redirect(authUrl);
});

// Callback
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  const tokenUrl = "https://oauth2.googleapis.com/token";

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
        grant_type: "authorization_code"
      })
    });

    const data = await response.json();
    console.log("YouTube Tokens:", data);

    res.cookie("youtube_access_token", data.access_token, { httpOnly: true });
    res.redirect("http://localhost:5173/youtubeplaylists");
  } catch (err) {
    console.error("YouTube Auth Error:", err);
    res.status(500).send("YouTube authentication failed");
  }
});

router.get("/playlists", async (req, res) => {
  const token = req.cookies.youtube_access_token;
  if (!token) {
    return res.status(401).json({ error: "No access token available" });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      {
        params: {
          part: "snippet,status",
          mine: true, // tells API to fetch the logged-in user's playlists
          maxResults: 25
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json(response.data);
    console.log("YouTube Playlists:", response.data);
  } catch (error) {
    console.error("YouTube API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch YouTube playlists" });
  }
});

// Create a new YouTube playlist
router.post("/playlists", async (req, res) => {
  const token = req.cookies.youtube_access_token;
  if (!token) {
    return res.status(401).json({ error: "No access token available" });
  }

  const { title, description, privacyStatus } = req.body;

  try {
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet,status",
      {
        snippet: {
          title: title || "My Exported Playlist - Migrator",
          description: description || "Created with Migrator"
        },
        status: {
          privacyStatus: privacyStatus || "private"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("YouTube Create Playlist Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create YouTube playlist" });
  }
});

// Add a track (video) to a YouTube playlist
router.post("/playlists/:playlistId/tracks", async (req, res) => {
  const token = req.cookies.youtube_access_token;
  if (!token) {
    return res.status(401).json({ error: "No access token available" });
  }

  const { videoId } = req.body; // YouTube videoId from search
  const { playlistId } = req.params;

  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId" });
  }

  try {
    const response = await axios.post(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
      {
        snippet: {
          playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "YouTube Add Track Error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to add track to YouTube playlist" });
  }
});

// Search YouTube for a track
router.get("/search", async (req, res) => {
  const token = req.cookies.youtube_access_token;
  if (!token) {
    return res.status(401).json({ error: "No access token available" });
  }

  const { query } = req.query; // e.g. "Song Name Artist"
  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          maxResults: 1,
          q: query,
          type: "video"
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const video = response.data.items[0];
    if (!video) {
      return res.status(404).json({ error: "No video found" });
    }

    res.json({
      videoId: video.id.videoId,
      title: video.snippet.title
    });
  } catch (error) {
    console.error("YouTube Search Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to search YouTube" });
  }
});


module.exports = router;
