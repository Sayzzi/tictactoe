# Tic-Tac-Toe

A simple Tic-Tac-Toe game built with Angular and served with Nginx inside a Docker container.

## Requirements

- [Docker](https://docs.docker.com/get-docker/) installed and running.
- That's it — you don't need Node.js or Angular installed locally. Everything is built inside the container.

## Run with Docker (recommended)

From the repository root, go into the app folder and start the container:

```bash
cd tictactoe
docker compose up --build
```

Then open your browser at:

```
http://localhost:8080
```

The first run takes a bit longer because Docker downloads the base images and builds the app. Next runs are much faster.

To stop the app, press `Ctrl + C`, then clean up the container with:

```bash
docker compose down
```

## How it works

- **Stage 1** — A Node.js image installs the dependencies and builds the Angular app (`npm run build`).
- **Stage 2** — The static build output is copied into an Nginx image that serves the app on port `8080`.

This multi-stage build keeps the final image small (no Node.js or source code in the running container).

## Run locally without Docker (optional)

If you prefer the Angular dev server:

```bash
cd tictactoe
npm install
npm start
```

Then open `http://localhost:4200`.

## Test the app

Open the app in your browser and play: click on a cell to place your mark, alternating between players. The game detects a win or a draw automatically.
