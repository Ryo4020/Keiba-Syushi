package bet

import (
	"fmt"
	"strconv"
	"unicode/utf8"
)

// 通常の組み合わせのコード->買い目
func (b *BettingContent) setGeneralBetCombination(code string) error {
	// コードは先頭が券種で組み合わせまで
	var betCombination [3][]int

	length := utf8.RuneCountInString(code)
	if !(length == 4 || length == 6) {
		return fmt.Errorf("invalid betting code (setGeneralBetCombination)")
	}

	for i := 0; i*2 < length; i++ {
		number, err := strconv.Atoi(code[i*2 : (i+1)*2])
		if err != nil {
			return fmt.Errorf("%w", err)
		}

		if number == 0 {
			break
		}
		betCombination[i] = []int{number}
	}

	b.BetCombination = betCombination
	return nil
}

// 2頭組みの馬券の流しのコード->買い目
func (b *BettingContent) setWheelOfPairCombination(code string) error {
	// コードは先頭が券種で相手の買い目まで
	const favoriteCodeIndex = 2
	const longShotCodeIndex = 9

	var betCombination [3][]int
	numberOfFavorite, err := strconv.Atoi(code[favoriteCodeIndex : favoriteCodeIndex+2])
	if err != nil {
		return fmt.Errorf("%w", err)
	} else if numberOfFavorite < 1 || numberOfFavorite > 18 {
		return fmt.Errorf("invalid betting code (setWheelOfPairCombination)")
	}
	betCombination[0] = []int{numberOfFavorite}

	betCombination[1] = readNumbersFromBitCode(code[longShotCodeIndex:])

	b.BetCombination = betCombination
	return nil
}

// 3頭組みのフォーメーション形式コード->買い目
func (b *BettingContent) setFormationOfTrioCombination(code string) error {
	// コードは先頭が券種で3頭目の買い目まで
	const firstSelectionCodeIndex = 2
	const secondSelectionCodeIndex = 20
	const thirdSelectionCodeIndex = 38

	var betCombination [3][]int
	betCombination[0] = readNumbersFromBitCode(code[firstSelectionCodeIndex:secondSelectionCodeIndex])
	betCombination[1] = readNumbersFromBitCode(code[secondSelectionCodeIndex:thirdSelectionCodeIndex])
	betCombination[2] = readNumbersFromBitCode(code[thirdSelectionCodeIndex:])

	b.BetCombination = betCombination
	return nil
}

// ボックス形式のコード->買い目
func (b *BettingContent) setBoxStyleCombination(code string) error {
	// コードは先頭が券種でボックスの買い目まで
	var numbers []int

	boxCode := code[1:]
	length := utf8.RuneCountInString(boxCode)
	if !(length == 10 || length == 20 || length == 36) {
		return fmt.Errorf("invalid betting code (setBoxStyleCombination)")
	}

	for i := 0; i*2 < length; i++ {
		number, err := strconv.Atoi(boxCode[i*2 : (i+1)*2])
		if err != nil {
			return fmt.Errorf("%w", err)
		}

		if number == 0 {
			break
		}
		numbers = append(numbers, number)
	}

	b.BetCombination[0] = numbers
	return nil
}

// 18桁のビットコード->選択された番号のslice
func readNumbersFromBitCode(code string) []int {
	var numbers []int
	for i, v := range code {
		if string(v) == "1" {
			numbers = append(numbers, i+1)
		}
	}

	return numbers
}
