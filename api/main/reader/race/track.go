package race

import (
	"fmt"
)

// コード->競馬場名
func readTrackName(code string) (string, error) {
	var tracks trackList
	tracks, err := decodeJSONFile(tracks, "../json/track-name.json")
	if err != nil {
		return "", fmt.Errorf("%w", err)
	}

	for _, v := range tracks {
		if v.Code == code {
			return v.Name, nil
		}
	}

	return "", fmt.Errorf("invalid track code")
}
