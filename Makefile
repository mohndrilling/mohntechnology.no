# Salmoscan.no — frontend (Astro) + kontakt-API (Go)
# Fra host uten Node: `make run-dev` (eller `make run dev`).
# Inne i Dev Container / med Node: `make frontend` eller `make dev`.

.DEFAULT_GOAL := help

export MAIL_TO ?= dev@example.com
export ALLOW_ORIGINS ?= http://localhost:4321,http://127.0.0.1:4321
export LISTEN ?= :8787

NODE_IMAGE ?= node:22-bookworm

.PHONY: help setup run run-dev docker-npm-ci \
	dev backend frontend build install-backend clean run-backend run-frontend

# Tillat: make run dev  (Make behandler ellers "dev" som eget mål)
ifeq (run,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(RUN_ARGS):;@:)
endif

help:
	@echo "Mål:"
	@echo "  make run-dev   — Astro i Docker (fra host uten Node) → :4321"
	@echo "  make run dev   — samme som run-dev"
	@echo "  make docker-npm-ci — npm ci i Docker (første gang / ny maskin)"
	@echo "  make dev       — Astro + Go contactapi parallelt (krever lokal Node/Go)"
	@echo "  make setup     — kopier .env.example til .env hvis .env mangler"
	@echo "  make backend   — kun Go API (MAIL_TO default: $(MAIL_TO))"
	@echo "  make frontend  — kun npm run dev (lokal Node)"
	@echo "  make build     — astro build + go build"
	@echo "  make install-backend — go mod download i backend/"
	@echo "  make clean     — fjern backend/bin/contactapi"
	@echo ""
	@echo "Tips: Ha PUBLIC_CONTACT_API_URL i .env (kjør make setup). SMTP — se backend/README.md"

setup:
	@test -f .env || cp .env.example .env
	@echo "Klar. Sjekk .env (PUBLIC_CONTACT_API_URL). Kjør: make run-dev  (eller make dev med lokal Node)"

run:
	@if [ "$(RUN_ARGS)" = "dev" ] || [ -z "$(RUN_ARGS)" ]; then \
		$(MAKE) run-dev; \
	else \
		echo "Ukjent: make run $(RUN_ARGS)"; \
		echo "Bruk: make run-dev   eller   make run dev"; \
		exit 1; \
	fi

run-dev:
	docker run --rm -it \
		--name salmoscan-astro-dev \
		-p 4321:4321 \
		-v "$(CURDIR)":/app \
		-w /app \
		-e ASTRO_TELEMETRY_DISABLED=1 \
		$(NODE_IMAGE) \
		npm run dev -- --host 0.0.0.0 --port 4321

docker-npm-ci:
	docker run --rm -it \
		-v "$(CURDIR)":/app \
		-w /app \
		$(NODE_IMAGE) \
		npm ci

# Kjør backend og frontend parallelt (Ctrl+C stopper vanligvis begge)
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
