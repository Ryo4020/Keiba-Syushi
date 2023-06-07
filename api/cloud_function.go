package cloudfunction

import (
	"github.com/Ryo4020/Keiba-Syushi/tree/main/api/main/handler"

	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
)

func init() {
	// Register an HTTP function with the Functions Framework
	functions.HTTP("ReaderFunction", handler.GetReadCode)
}
