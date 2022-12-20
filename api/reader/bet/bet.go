package bet

import (
	"fmt"
)

// 読み取れる馬券の購入情報
type BettingContent struct {
	// 馬券の種類
	Type string

	// 馬券の購入の形式
	Style string

	// 1点あたりの賭け金（円）
	Price int

	// 購入した組み合わせ
	BetCombination [3][]int
}

const priceCodeLength = 5

// コード->購入内容
func ReadBet(code string) ([]BettingContent, error) {
	style, err := readBettingStyle(code)
	if err != nil {
		return []BettingContent{}, fmt.Errorf("%w", err)
	}

	code = code[:style.PatternIndex]
	bets := make([]BettingContent, 1)
	switch style.ID {
	case 1, 4, 5, 6, 7, 8, 9:
		bets[0], err = readSingleBetProperty(code, style)
	case 2, 3:
		bets, err = readMultiBetsProperty(code, style)
	default:
		err = fmt.Errorf("read betting type error")
	}
	if err != nil {
		return []BettingContent{}, fmt.Errorf("%w", err)
	}

	return bets, nil
}

// コード->フィールドに値が入ったBettingContent構造体
func readSingleBetProperty(code string, style bettingStyle) (BettingContent, error) {
	var bet BettingContent

	// Style
	bet.Style = style.Label

	// Type
	typeCode := code[0:1]
	_, err := bet.setTypeFromCode(typeCode)
	if err != nil {
		return bet, fmt.Errorf("%w", err)
	}
	// Price
	priceCode := code[style.PriceIndex : style.PriceIndex+priceCodeLength]
	err = bet.setPriceFromCode(priceCode)
	if err != nil {
		return bet, fmt.Errorf("%w", err)
	}

	// BetCombination
	switch style.ID {
	case 1:
		err = bet.setWheelOfPairCombination(code)
	case 4, 5, 6:
		err = bet.setFormationOfTrioCombination(code[:style.PriceIndex])
	case 7, 8, 9:
		err = bet.setBoxStyleCombination(code[:style.PriceIndex])
	default:
		err = fmt.Errorf("read invalid betting style ID error")
	}
	if err != nil {
		return bet, fmt.Errorf("%w", err)
	}

	return bet, nil
}

// 通常または応援馬券のコード->フィールドに値が入ったBettingContent構造体
func readMultiBetsProperty(code string, style bettingStyle) ([]BettingContent, error) {
	var bets []BettingContent

	for index := 0; index < style.PatternIndex; {
		var bet BettingContent

		// Style
		bet.Style = style.Label

		// Type
		typeCode := code[index : index+1]
		ticketType, err := bet.setTypeFromCode(typeCode)
		if err != nil {
			return bets, fmt.Errorf("%w", err)
		}

		// Price
		priceLastIndex := index + ticketType.CodeLength
		priceStartIndex := priceLastIndex - priceCodeLength
		priceCode := code[priceStartIndex:priceLastIndex]
		err = bet.setPriceFromCode(priceCode)
		if err != nil {
			return bets, fmt.Errorf("%w", err)
		}

		// BetCombination
		err = bet.setGeneralBetCombination(code[index+1 : priceStartIndex])
		if err != nil {
			return bets, fmt.Errorf("%w", err)
		}

		bets = append(bets, bet)
		index += ticketType.CodeLength
	}

	return bets, nil
}
