package reader

import (
	"fmt"
	"unicode/utf8"

	"keiba-syushi/reader/bet"
	"keiba-syushi/reader/race"
)

type (
	TicketPropertyFromCode struct {
		Race race.BettingRace
		Bet  []bet.BettingContent
	}
)

// QRコードから取得される数字のコード->馬券情報
func ReadCode(code string) (TicketPropertyFromCode, error) {
	length := utf8.RuneCountInString(code)
	if length != 190 {
		return TicketPropertyFromCode{}, fmt.Errorf("invalid length code")
	}

	bettingRace, err := race.ReadRace(code)
	if err != nil {
		return TicketPropertyFromCode{}, fmt.Errorf("%w (ReadRace)", err)
	}

	// 馬券の購入情報より前の部分をカット
	const bettingIndex = 42
	bettingCode := code[bettingIndex:]

	bettingContents, err := bet.ReadBet(bettingCode)
	if err != nil {
		return TicketPropertyFromCode{}, fmt.Errorf("%w (ReadTickets)", err)
	}

	return TicketPropertyFromCode{bettingRace, bettingContents}, nil
}
