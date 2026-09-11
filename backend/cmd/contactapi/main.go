// Contact form API: accepts JSON POST, sends mail via SMTP (or logs in dev).
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"strings"
	"time"
)

const maxBodyBytes = 1 << 20 // 1 MiB

type contactPayload struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
	Honeypot string `json:"company"` // must stay empty (anti-bot)
}

func main() {
	addr := env("LISTEN", ":8787")
	allow := env("ALLOW_ORIGINS", "http://localhost:4321,http://127.0.0.1:4321")
	mux := http.NewServeMux()
	mux.HandleFunc("/api/contact", withCORS(allow, handleContact))
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	log.Printf("contactapi listening on %s (ALLOW_ORIGINS=%s)", addr, allow)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

func withCORS(allowList string, next http.HandlerFunc) http.HandlerFunc {
	origins := map[string]bool{}
	for _, o := range strings.Split(allowList, ",") {
		o = strings.TrimSpace(o)
		if o != "" {
			origins[o] = true
		}
	}
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin != "" && origins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
			w.Header().Set("Access-Control-Max-Age", "86400")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

func handleContact(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method_not_allowed"}`, http.StatusMethodNotAllowed)
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)

	var p contactPayload
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_json"})
		return
	}

	p.Name = strings.TrimSpace(p.Name)
	p.Email = strings.TrimSpace(p.Email)
	p.Message = strings.TrimSpace(p.Message)
	p.Honeypot = strings.TrimSpace(p.Honeypot)

	if p.Honeypot != "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "rejected"})
		return
	}
	if len(p.Name) == 0 || len(p.Name) > 200 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_name"})
		return
	}
	if len(p.Message) < 3 || len(p.Message) > 20000 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_message"})
		return
	}
	if _, err := mail.ParseAddress(p.Email); err != nil || len(p.Email) > 320 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_email"})
		return
	}

	mailTo := env("MAIL_TO", "")
	if mailTo == "" {
		log.Print("MAIL_TO not set; refusing to accept messages")
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "server_misconfigured"})
		return
	}

	subject := fmt.Sprintf("[Salmoscan contact] %s", truncate(stripCRLF(p.Name), 80))
	body := fmt.Sprintf(
		"Navn / Name: %s\nE-post / Email: %s\nTid / Time: %s\n\n%s\n",
		p.Name, p.Email, time.Now().UTC().Format(time.RFC3339), p.Message,
	)

	smtpHost := env("SMTP_HOST", "")
	if smtpHost == "" {
		log.Printf("[dev/log] contact from %q <%s> subject=%q\n%s", p.Name, p.Email, subject, body)
		writeJSON(w, http.StatusOK, map[string]string{"ok": "logged"})
		return
	}

	mailFrom := env("MAIL_FROM", mailTo)
	if err := sendSMTP(smtpHost, mailFrom, mailTo, p.Email, subject, body); err != nil {
		log.Printf("smtp error: %v", err)
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": "send_failed"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"ok": "sent"})
}

func sendSMTP(smtpHost, from, to, replyTo, subject, body string) error {
	port := env("SMTP_PORT", "587")
	user := env("SMTP_USER", "")
	pass := env("SMTP_PASSWORD", "")
	addr := smtpHost + ":" + port

	headers := fmt.Sprintf(
		"From: %s\r\nTo: %s\r\nReply-To: %s\r\nSubject: %s\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n",
		from, to, replyTo, subject,
	)
	msg := []byte(headers + body + "\r\n")

	if user == "" && pass == "" {
		return smtp.SendMail(addr, nil, from, []string{to}, msg)
	}
	auth := smtp.PlainAuth("", user, pass, smtpHost)
	return smtp.SendMail(addr, auth, from, []string{to}, msg)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func env(key, def string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return def
}

func stripCRLF(s string) string {
	return strings.NewReplacer("\r", " ", "\n", " ").Replace(s)
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}
