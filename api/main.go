package main

import (
	"fmt"

	"keiba-syushi/reader"
)

func main() {
	ticket, err := reader.ReadCode("50900022040511500200458454380909300995306710900000012090000001089012345678901234567890123456789")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(ticket)
}
