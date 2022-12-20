package bet

import (
	"fmt"
	"strconv"
)

// コード->馬券の金額
func (b *BettingContent) setPriceFromCode(code string) error {
	const pricePerPoint = 100

	pricePoint, err := strconv.Atoi(code)
	if err != nil {
		return fmt.Errorf("%w", err)
	}

	b.Price = pricePoint * pricePerPoint

	return nil
}
