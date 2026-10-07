# mohntechnology.no

Company site for [Mohn Technology](https://mohntechnology.no) — Salmoscan, Codcam, and Rivercam.

## Two tracks

| Track | Where | How |
|-------|--------|-----|
| **DEV** (feedback) | This repo | `make dev-up` → `http://<lan-ip>/` (port **80**) |
| **PUBLIC** | `Server` repo (Miraculix) | Release tag → Docker images → Caddy |

DEV and PUBLIC both want host port 80 — only one at a time on the same machine.

## Develop (LAN feedback)

```sh
make setup          # once: creates .env
make dev-up         # Caddy + Astro + contactapi on :80
```

Without `make`:

```sh
cp -n .env.example .env
docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml logs -f
docker compose -f docker-compose.dev.yml down
```

Share: `http://<lan-ip>/` (this host: `http://192.168.10.124/`). Add that origin to `ALLOW_ORIGINS` in `.env` if needed.

If port 80 is busy (Server/Caddy), stop that stack first.

Without Docker proxy (Astro only on `:4321`): `make run-dev`.

With local Node/Go: `npm install && make dev`.

## Release (public images)

```sh
git tag v1.2.0
git push origin v1.2.0
```

GitHub Actions builds and pushes:

- `docker.mohntechnology.no/mohntechnology.no:v1.2.0`
- `docker.mohntechnology.no/mohntechnology-contactapi:v1.2.0`

Requires repo secrets `REGISTRY_USERNAME` / `REGISTRY_PASSWORD`.

On Miraculix (`Server` / branch `Miraculix`), set `SITE_TAG=v1.2.0` and pull.

## Build images locally

```sh
docker build -f docker/Dockerfile.web \
  --build-arg PUBLIC_CONTACT_API_URL=https://mohntechnology.no/api/contact \
  -t docker.mohntechnology.no/mohntechnology.no:dev .

docker build -f docker/Dockerfile.contactapi \
  -t docker.mohntechnology.no/mohntechnology-contactapi:dev .
```
