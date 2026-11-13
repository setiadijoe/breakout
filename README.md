# Breakout

A browser-based Breakout game built with JavaScript and Vite.

## Run locally

Use Node.js 20.19 or newer. Copy `.env.example` to `.env` and set
`VITE_TITLE_GAME_ID` to the Breakout title game ID:

```sh
npm install
npm run dev
```

During development, Vite proxies `/api`. To submit scores locally, use a local
game server at `http://localhost:3000` because production accepts score writes
only from approved game origins. Configure `VITE_API_BASE_URL` and
`VITE_TITLE_GAME_ID` in the production deployment environment. Vite variables
are public browser configuration; never put secrets in them.

The page loads the top score and leaderboard from `/api/scores`. At game over,
enter a player name to save the run's score. The deployed Breakout origin must
be allowed by the game server's CORS configuration.

Build production assets with `npm run build`.
