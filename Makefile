# Salmoscan.no — frontend (Astro) + kontakt-API (Go)
# Kjør `make dev` for begge samtidig. Sett MAIL_TO første gang (eller bruk default under).

.DEFAULT_GOAL := help

export MAIL_TO ?= dev@example.com
export ALLOW_ORIGINS ?= http://localhost:4321,http://127.0.0.1:4321
export LISTEN ?= :8787

.PHONY: help dev backend frontend build install-backend clean run-backend run-frontend setup

help:
	@echo "Mål:"
	@echo "  make dev       — Astro dev-server + Go contactapi (parallelt)"
	@echo "  make setup     — kopier .env.example til .env hvis .env mangler"
	@echo "  make backend   — kun Go API (MAIL_TO default: $(MAIL_TO))"
	@echo "  make frontend  — kun npm run dev"
	@echo "  make build     — astro build + go build"
	@echo "  make install-backend — go mod download i backend/"
	@echo "  make clean     — fjern backend/bin/contactapi"
	@echo ""
	@echo "Tips: Ha PUBLIC_CONTACT_API_URL i .env (kjør make setup). SMTP — se backend/README.md"

setup:
	@test -f .env || cp .env.example .env
	@echo "Klar. Sjekk .env (PUBLIC_CONTACT_API_URL). Kjør: make dev"

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
