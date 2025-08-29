const express = require('express');
const router = express.Router();
const axios = require('axios'); 

router.post('/spotifytoyoutube', async (req, res) => {
    try {
        const { spotifyPlaylist, youtubePlaylistTitle } = req.body; // <-- send playlistId only
        const youtubeApi = req.cookies.youtube_access_token;
        const spotifyToken = req.cookies.spotify_access_token;

        if (!spotifyToken) {
            return res.status(401).json({ error: 'Spotify Unauthorized' });
        }
        if (!youtubeApi) {
            return res.status(401).json({ error: 'YouTube Unauthorized' });
        }

        const playlistId = typeof spotifyPlaylist === "string" ? spotifyPlaylist : spotifyPlaylist.id;
        // create YouTube playlist
        const response = await axios.post(
            'https://www.googleapis.com/youtube/v3/playlists?part=snippet',
            {
                snippet: {
                    title: youtubePlaylistTitle || spotifyPlaylist.name,
                    description: spotifyPlaylist.description || 'Playlist migrated from Spotify',
                },
            },
            { headers: { Authorization: `Bearer ${youtubeApi}` } }
        );
        const youtubePlaylistId = response.data.id;

        const playlistRes = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${spotifyToken}` }
        });
        // fetch playlist tracks explicitly
        const tracksRes = await axios.get(spotifyPlaylist.tracks.href, {
            headers: { Authorization: `Bearer ${spotifyToken}` }
        });
        const tracks = tracksRes.data.items;

        function sleep(ms)
        {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        // loop through each track
        for (const item of tracks) {
            const track = item.track; // <-- unwrap correctly
            if (!track) continue;

            const query = `${track.name} ${track.artists.map(a => a.name).join(" ")}`;
            const searchRes = await axios.get(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=5&q=${encodeURIComponent(query)}`,
                { headers: { Authorization: `Bearer ${youtubeApi}` } }
            );

            if (searchRes.data.items.length > 0) {
                const videoId = searchRes.data.items[0].id.videoId;

                await axios.post(
                    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
                    {
                        snippet: {
                            playlistId: youtubePlaylistId,
                            resourceId: { kind: "youtube#video", videoId },
                        },
                    },
                    { headers: { Authorization: `Bearer ${youtubeApi}` } }
                );
                await sleep(300); // to avoid rate limits
            }
        }

        res.json({ success: true, youtubePlaylistId });
    } catch (error) {
        console.error('Error migrating playlist:', error.response?.data || error.message);
        res.status(500).json({ error: "Migration failed", details: error.message });
    }
});

module.exports = router;
