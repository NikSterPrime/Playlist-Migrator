## Playlist Migrator
## A full-stack application for seamlessly migrating playlists from Spotify to YouTube, built using the Spotify and YouTube Data APIs.

## Key Features
OAuth 2.0 Authentication: Securely authenticates users with both Spotify and Google (for YouTube) without storing any sensitive credentials.

Playlist Discovery: Fetches and displays a user's Spotify playlists.

Intelligent Song Matching: Uses a robust search algorithm to find the correct video on YouTube for each song, handling variations in song titles and artist names.

Real-time Progress: Provides a live progress bar to inform the user of the migration status.

Error Handling: Gracefully handles songs that cannot be found on YouTube and other API-related errors.

## Technologies
Backend (Express.js)
Express.js: A fast, minimalist web framework for Node.js, used to create the RESTful API endpoints.

Axios: A promise-based HTTP client for making API requests to Spotify and YouTube.

dotenv: Manages environment variables for API keys and secrets.

Node.js: The JavaScript runtime environment.

Frontend (React)
React: A JavaScript library for building the user interface.

React Router: For handling client-side routing.

Context API: Manages global state, such as user authentication status.

CSS Modules: For component-level styling.

