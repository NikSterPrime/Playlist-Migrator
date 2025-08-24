const express = require("express");
const router = express.Router();

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
    res.redirect("http://localhost:5173/playlists");
  } catch (err) {
    console.error("YouTube Auth Error:", err);
    res.status(500).send("YouTube authentication failed");
  }
});

module.exports = router;
