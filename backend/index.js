const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const spotifyRoutes = require('./routes/spotifyRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({ origin: 'http://127.0.0.1:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req,res) => {
    res.send("Backend is running ✅");
});

// Mount routes
app.use("/auth/spotify", spotifyRoutes);
app.use("/spotify", spotifyRoutes);
app.use("/youtube", youtubeRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
