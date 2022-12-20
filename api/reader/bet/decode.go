package bet

import (
	"encoding/json"
	"fmt"
	"os"
)

type (
	decodedType interface {
		bettingStyleList | ticketTypeList
	}

	bettingStyleList [9]bettingStyle
	bettingStyle     struct {
		ID          int    `json:"id"`
		CodePattern string `json:"codePattern"`
		Label       string `json:"label"`
		// 券種が先頭のコードでのそれぞれが始まるインデックス
		PatternIndex int `json:"patternIndex"`
		PriceIndex   int `json:"priceIndex"`
	}

	ticketTypeList [9]ticketType
	ticketType     struct {
		Code       string `json:"code"`
		Name       string `json:"name"`
		CodeLength int    `json:"codeLength"`
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
