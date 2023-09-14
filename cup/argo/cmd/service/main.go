package main

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
	"strings"
)

const addr = ":8282"

func main() {
	env := map[string]string{}
	for _, pair := range os.Environ() {
		left, right, match := strings.Cut(pair, "=")
		if !match {
			env[pair] = ""
			continue
		}

		env[left] = right
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if err := json.NewEncoder(w).Encode(map[string]any{
			"env": env,
		}); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	slog.Info("Listening...", "addr", addr)

	http.ListenAndServe(addr, nil)
}
