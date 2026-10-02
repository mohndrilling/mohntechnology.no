# mohntechnology.no

Company site for [Mohn Technology](https://mohntechnology.no) — Salmoscan, Codcam, and Rivercam.

## Develop

```sh
npm install
npm run dev
```

From a host without Node: `make run-dev` (Docker).

## Build

```sh
npm run build
```

## Docker (production)

```sh
# Static site (nginx)
docker build -f docker/Dockerfile.web \
  --build-arg PUBLIC_CONTACT_API_URL=https://mohntechnology.no/api/contact \
  -t docker.mohntechnology.no/mohntechnology.no:latest .

# Contact API
docker build -f docker/Dockerfile.contactapi \
  -t docker.mohntechnology.no/mohntechnology-contactapi:latest .
```

Deploy on Miraculix via the `Server` repo branch `Miraculix` (Caddy + compose).
