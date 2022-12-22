package main

import (
	"log"
	"net/http"

	"keiba-syushi/handler"
)

func main() {
	log.Fatalf("%+v", serve())
}

func serve() error {
	handler := handler.New()
	return http.ListenAndServe("127.0.0.1:8000", handler)
}
