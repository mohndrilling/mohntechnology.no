# Dev Container – Go + Vue 3

This dev container gives you a consistent environment for:

- **Backend:** Go 1.23 (with standard tooling)
- **Frontend:** Node.js 22 + Vue 3 (Volar, ESLint, Prettier, Tailwind CSS)

## Ports

- **5173** – Vue dev server (Vite default)
- **8080** – Go backend (e.g. `go run` or your HTTP server)

## After opening in container

1. **Vue 3 app (Vite):**  
   `npm create vue@latest` then `cd <app> && npm install && npm run dev`

2. **Go backend:**  
   `go mod init <module>` and run your server on port 8080.

Rebuild the container if you change `.devcontainer/` (e.g. Dockerfile or devcontainer.json).
