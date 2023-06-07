package handler

import (
	"net/http"

	"github.com/rs/cors"
)

func New() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/reader", GetReadCode)

	cors := newCORS()
	handler := cors.Handler(mux)

	return handler
}

// CORS対応
func newCORS() *cors.Cors {
	return cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})
}
