package main

import (
	"log"
	"net/http"

	"github.com/Ryo4020/Keiba-Syushi/tree/main/api/main/handler"
)

func main() {
	// 実行はこの/mainフォルダから
	log.Fatalf("%+v", serve())
}

// ローカル環境でサーバー
func serve() error {
	handler := handler.New()
	return http.ListenAndServe("127.0.0.1:8000", handler)
}
