package bet

import "fmt"

// コード->馬券の種類
func (b *BettingContent) setTypeFromCode(code string) (ticketType, error) {
	var ticketTypes ticketTypeList
	ticketTypes, err := decodeJSONFile(ticketTypes, "reader/json/ticket-type.json")
	if err != nil {
		return ticketType{}, fmt.Errorf("%w", err)
	}

	for _, v := range ticketTypes {
		if v.Code == code {
			b.Type = v.Name
			return v, nil
		}
	}

	return ticketType{}, fmt.Errorf("invalid betting ticket code")
}
