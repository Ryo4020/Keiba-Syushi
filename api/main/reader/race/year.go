package race

import (
	"fmt"
	"strconv"
	"time"
)

// コード->開催年
func readYear(code string) (string, error) {
	codeNum, err := strconv.Atoi(code)
	if err != nil {
		return "", fmt.Errorf("%w", err)
	}

	y := time.Now().Year()
	century := y / 100
	// 下2桁が現在より大きいなら一世紀前とする
	if centuryYear := y % 100; codeNum > centuryYear+1 {
		century--
	}

	year := strconv.Itoa(century) + code

	return year, nil
}
