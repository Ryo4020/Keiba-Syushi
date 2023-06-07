package race

import (
	"fmt"
	"strconv"
)

// 読み取れる馬券のレース情報
type BettingRace struct {
	// 競馬場名
	Track string

	// 開催年（西暦）
	Year string

	// 競馬場の開催回
	Turn int

	// 開催日
	Day int

	// 開催レース番号
	Number int
}

func ReadRace(code string) (BettingRace, error) {
	var bettingRace BettingRace
	var err error

	trackCode := code[1:3]
	bettingRace.Track, err = readTrackName(trackCode)
	if err != nil {
		return BettingRace{}, fmt.Errorf("%w (readTrackName)", err)
	}

	yearCode := code[6:8]
	bettingRace.Year, err = readYear(yearCode)
	if err != nil {
		return BettingRace{}, fmt.Errorf("%w (readYear)", err)
	}

	turnCode := code[8:10]
	bettingRace.Turn, err = strconv.Atoi(turnCode)
	if err != nil {
		return BettingRace{}, fmt.Errorf("%w (convTurn)", err)
	}

	dayCode := code[10:12]
	bettingRace.Day, err = strconv.Atoi(dayCode)
	if err != nil {
		return BettingRace{}, fmt.Errorf("%w (convDay)", err)
	}

	raceCode := code[12:14]
	bettingRace.Number, err = strconv.Atoi(raceCode)
	if err != nil {
		return BettingRace{}, fmt.Errorf("%w (convRaceNum)", err)
	}

	return bettingRace, nil
}
