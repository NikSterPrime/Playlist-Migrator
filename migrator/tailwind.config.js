/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        spotifyPastel: '#A8E6CF',     // Spotify accent
        youtubePastel: '#FFAAA5',     // YouTube accent
        pastelBlue: '#B5EAD7',        // Neutral secondary
        pastelYellow: '#FFEBB7',      // Hover/alert
        softWhite: '#FAFAFA',         // Background
        mutedDark: '#4F4F4F',         // Text
      },
      backgroundImage: {
        'spotify-youtube-gradient': 'linear-gradient(135deg, #A8E6CF, #FFAAA5)',
        'soft-glow': 'linear-gradient(135deg, rgba(168, 230, 207, 0.8), rgba(255, 170, 165, 0.8))',
      },
      boxShadow: {
        'soft-glow': '0 4px 15px rgba(168, 230, 207, 0.3), 0 4px 15px rgba(255, 170, 165, 0.3)',
      },
    },
  },
  plugins: [],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
};
