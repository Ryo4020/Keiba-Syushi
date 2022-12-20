package bet

import (
	"fmt"
	"strings"
	"unicode/utf8"
)

// コード->購入の形式
func readBettingStyle(code string) (bettingStyle, error) {
	var styles bettingStyleList
	styles, err := decodeJSONFile(styles, "reader/json/betting-style-type.json")
	if err != nil {
		return bettingStyle{}, fmt.Errorf("%w", err)
	}

	var generalStyleIndex int
	for i, v := range styles {
		index := strings.Index(code, v.CodePattern)
		if index == v.PatternIndex {
			if v.ID == 1 && code[v.PatternIndex-1:v.PatternIndex] == "9" {
				// 他のパターンが一致した際の分岐
				continue
			}
			return v, nil
		} else if v.PatternIndex == 0 {
			generalStyleIndex = i
			if index != -1 { // ”通常”形式に一致する場合
				v.PatternIndex = index
				return v, nil
			}
		}
	}

	// パターンが不明=>長さが自由な”通常”形式のみ
	generalStyle := styles[generalStyleIndex]
	generalStyle.PatternIndex = utf8.RuneCountInString(code)
	return generalStyle, nil
}
