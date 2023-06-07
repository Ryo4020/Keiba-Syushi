package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

// 関数のファイルからの相対パスを、ワークディレクトリからの相対パスに変換
func GetPathFromWD(fileName string) (string, error) {
	_, path, _, ok := runtime.Caller(1)
	if !ok {
		return "", fmt.Errorf("read file path error")
	}

	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}

	path, err = filepath.Rel(dir, path)
	if err != nil {
		return "", err
	}

	path = filepath.Join(filepath.Dir(path), fileName)
	return path, nil
}
