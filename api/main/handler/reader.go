package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"keiba-syushi/main/reader"
)

// Request for `GET /reader?code=***`
func getReadCode(w http.ResponseWriter, r *http.Request) {
	code := r.FormValue("code")

	ticket, err := reader.ReadCode(code)
	if err != nil {
		http.Error(w, fmt.Sprint(err.Error()), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(ticket); err != nil {
		log.Printf("[InternalServerError] %+v", err)
		http.Error(w, fmt.Sprint(err.Error()), http.StatusInternalServerError)
		return
	}
}
