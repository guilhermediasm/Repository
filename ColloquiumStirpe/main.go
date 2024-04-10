package main

import (
	"github.com/guilhermediasm/colloquiumStirpe/config"
	"github.com/guilhermediasm/colloquiumStirpe/router"
)

var (
	logger *config.Logger
)

func main() {
	logger = config.GetLogger("main")

	err := config.Init()

	if err != nil {
		logger.Errorf("config initialization error: %v", err)
		return
	}

	router.Initialize()
}
