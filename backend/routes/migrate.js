const express = require('express');
const router = express.Router();
const axios = require('axios'); 

router.post('/spotifytoyoutube',async(req, res) => {
    try {
        const {spotifyPlayist,youtubePlaylistTitile} = req.body;
        const youtubeApi = req.cookies.youtube_access_token;
        if(!youtubeApi){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const response = await axios.post('https://www.googleapis.com/youtube/v3/playlists?part=snippet', {
            snippet: {
                title: youtubePlaylistTitile || spotifyPlayist.name,
                description: spotifyPlayist.description || 'Playlist migrated from Spotify',
            },
        },
        { headers: { Authorization: `Bearer ${youtubeApi}` } }
        );
        const youtubePlaylistId = response.data.id;

        for(const track in spotifyPlayist.tracks){
            const query = `${track.name} ${track.artists?.name}`;
            const searchRes = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}`,
            {  headers: { Authorization: `Bearer ${youtubeApi}` } }
        );
            console.log(searchRes.data);
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
            }
        }
        res.json({success: true, youtubePlaylistId: youtubePlaylistId});
    }
    catch(error){
        console.error('Error migrating playlist:',error);
        res.status(500).json({error:"Migration failed",details:error.message});
    }
});

module.exports = router;