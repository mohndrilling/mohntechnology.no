# mohntechnology.no — frontend (Astro) + contact API (Go)
#
# Two tracks:
#   DEV (this repo)  — make dev-up   → http://<lan-ip>/  (port 80)
#   PUBLIC (Server)  — release tag → pull images behind Caddy

.DEFAULT_GOAL := help

export MAIL_TO ?= dev@example.com
export ALLOW_ORIGINS ?= http://127.0.0.1,http://localhost,http://192.168.10.124
export LISTEN ?= :8787
export PUBLIC_CONTACT_API_URL ?= /api/contact

NODE_IMAGE ?= node:22-bookworm
COMPOSE_DEV := docker compose -f docker-compose.dev.yml

.PHONY: help setup \
	dev-up dev-down dev-logs dev-ps \
	run run-dev docker-npm-ci \
	dev backend frontend build install-backend clean \
	run-backend run-frontend

# Tillat: make run dev
ifeq (run,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(RUN_ARGS):;@:)
endif

help:
	@echo "DEV (LAN feedback, host :80):"
	@echo "  make setup     — .env fra .env.example hvis mangler"
	@echo "  make dev-up    — Caddy + Astro + contactapi → http://<lan-ip>/"
	@echo "  make dev-down  — stopp DEV-stacken"
	@echo "  make dev-logs  — følg logger"
	@echo "  make dev-ps    — status"
	@echo ""
	@echo "Merk: DEV eier port 80. Stopp Server/Caddy først om den kjører:"
	@echo "  cd ../Server/docker && docker compose down"
	@echo ""
	@echo "Lokal uten compose (krever Node/Go):"
	@echo "  make dev       — Astro + contactapi parallelt"
	@echo "  make run-dev   — kun Astro i Docker på :4321 (uten proxy)"
	@echo "  make build     — astro build + go build"
	@echo ""
	@echo "Release (public): git tag vX.Y.Z && git push origin vX.Y.Z"
	@echo "  → CI pusher images; Server setter SITE_TAG=vX.Y.Z og puller."

setup:
	@test -f .env || cp .env.example .env
	@echo "Klar. Sjekk .env (ALLOW_ORIGINS / LAN-IP). Kjør: make dev-up"

dev-up: setup
	@if ss -tln | awk '{print $$4}' | grep -qE '(:|^)80$$'; then \
		echo "Port 80 er opptatt. Stopp public/Caddy først, f.eks.:"; \
		echo "  cd ../Server/docker && docker compose -f docker-compose.yml -f docker-compose.local.yml down"; \
		echo "  # eller: docker stop caddy_proxy"; \
		exit 1; \
	fi
	NODE_IMAGE="$(NODE_IMAGE)" \
	PUBLIC_CONTACT_API_URL="$(PUBLIC_CONTACT_API_URL)" \
	ALLOW_ORIGINS="$(ALLOW_ORIGINS)" \
	MAIL_TO="$(MAIL_TO)" \
	$(COMPOSE_DEV) up -d --build
	@echo ""
	@echo "DEV oppe:  http://127.0.0.1/  og  http://$$(hostname -I | awk '{print $$1}')/"
	@echo "Logs:      make dev-logs"

dev-down:
	$(COMPOSE_DEV) down

dev-logs:
	$(COMPOSE_DEV) logs -f

dev-ps:
	$(COMPOSE_DEV) ps

run:
	@if [ "$(RUN_ARGS)" = "dev" ] || [ -z "$(RUN_ARGS)" ]; then \
		$(MAKE) run-dev; \
	else \
		echo "Ukjent: make run $(RUN_ARGS)"; \
		echo "Bruk: make dev-up   (anbefalt, :80)  eller  make run-dev (:4321)"; \
		exit 1; \
	fi

run-dev:
	docker run --rm -it \
		--name mohntech-astro-dev \
		-p 4321:4321 \
		-v "$(CURDIR)":/app \
		-w /app \
		-e ASTRO_TELEMETRY_DISABLED=1 \
		-e PUBLIC_CONTACT_API_URL="$(PUBLIC_CONTACT_API_URL)" \
		$(NODE_IMAGE) \
		sh -c "npm ci && npm run dev -- --host 0.0.0.0 --port 4321"

docker-npm-ci:
	docker run --rm -it \
		-v "$(CURDIR)":/app \
		-w /app \
		$(NODE_IMAGE) \
		npm ci

dev:
	$(MAKE) -j2 run-backend run-frontend

run-backend:
	cd backend && MAIL_TO="$(MAIL_TO)" ALLOW_ORIGINS="$(ALLOW_ORIGINS)" LISTEN="$(LISTEN)" go run ./cmd/contactapi

run-frontend:
	npm run dev

backend:
	cd backend && MAIL_TO="$(MAIL_TO)" ALLOW_ORIGINS="$(ALLOW_ORIGINS)" LISTEN="$(LISTEN)" go run ./cmd/contactapi

frontend:
	npm run dev

build: install-backend
	npm run build
	cd backend && go build -o bin/contactapi ./cmd/contactapi

install-backend:
	cd backend && go mod download

clean:
	rm -f backend/bin/contactapi
