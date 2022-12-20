package race

import (
	"encoding/json"
	"fmt"
	"os"
)

type (
	decodedType interface {
		trackList
	}

	trackList [10]track
	track     struct {
		Code string `json:"code"`
		Name string `json:"track"`
	}
)

// jsonファイルの内容を受け取った型の構造体に変換
func decodeJSONFile[T decodedType](t T, fileName string) (T, error) {
	file, err := os.Open(fileName)
	if err != nil {
		return t, fmt.Errorf("%w", err)
	}
	defer file.Close()

	decoded := t
	err = json.NewDecoder(file).Decode(&decoded)
	if err != nil {
		return t, fmt.Errorf("%w", err)
	}

	return decoded, nil
}
