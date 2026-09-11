# contactapi — kontaktskjema-backend

Liten HTTP-tjeneste som tar imot `POST /api/contact` (JSON) og sender e-post via SMTP, eller **logger til stdout** hvis `SMTP_HOST` ikke er satt (nyttig lokalt).

## Kjøre lokalt

**Enklest — fra rot av repo (Astro + API samtidig):**

```bash
make setup          # første gang: lager .env fra .env.example
MAIL_TO=din@epost.no make dev
```

Standard API-adresse: `http://127.0.0.1:8787`. Helsecheck: `GET http://127.0.0.1:8787/healthz`

**Kun API** — fra `backend/`:

```bash
export MAIL_TO=din@epost.no
export ALLOW_ORIGINS=http://localhost:4321,http://127.0.0.1:4321
go run ./cmd/contactapi
```

**Kun frontend** — fra rot: `npm run dev` (husk `PUBLIC_CONTACT_API_URL` i `.env`).

`PUBLIC_CONTACT_API_URL` leses av Astro ved **build/dev-start** — start `astro dev` på nytt etter endring.

## JSON-kropp

```json
{
  "name": "Ola Nordmann",
  "email": "ola@example.com",
  "message": "Hei …",
  "company": ""
}
```

Feltet `company` er honeypot og **må være tomt**.

## Miljøvariabler

| Variabel | Beskrivelse |
|----------|-------------|
| `LISTEN` | Adresse å lytte på (default `:8787`) |
| `ALLOW_ORIGINS` | Kommaseparerte origins for CORS (nettleser krever treff mot `Origin`-header) |
| `MAIL_TO` | **Påkrevd** — mottaker av henvendelser |
| `MAIL_FROM` | `From:`-adresse (default samme som `MAIL_TO`) |
| `SMTP_HOST` | Tom = **ingen e-post**, melding logges og API svarer `{ "ok": "logged" }` |
| `SMTP_PORT` | Default `587` |
| `SMTP_USER` / `SMTP_PASSWORD` | Valgfri SMTP-innlogging (tom = ingen auth, f.eks. MailHog) |

## Eksempel med SMTP (f.eks. transaksjonell leverandør)

```bash
export MAIL_TO=mottak@salmoscan.no
export MAIL_FROM=kontaktskjema@salmoscan.no
export SMTP_HOST=smtp.example.com
export SMTP_PORT=587
export SMTP_USER=…
export SMTP_PASSWORD=…
export ALLOW_ORIGINS=https://salmoscan.no,https://www.salmoscan.no
go run ./cmd/contactapi
```

## Produksjon

- Kjør bak reverse proxy (TLS terminering der).
- Sett `ALLOW_ORIGINS` til **kun** dine ekte nettside-URL-er (aldri `*` i produksjon).
- Vurder rate limiting og overvåking — denne tjenesten er bevisst minimal.

## Bygge binær

```bash
go build -o bin/contactapi ./cmd/contactapi
```
