package handler

import (
	"github.com/guilhermediasm/colloquiumStirpe/config"

	"gorm.io/gorm"
)

var (
	logger *config.Logger
	db     *gorm.DB
)

func InitializeHandler() {
	logger = config.GetLogger("handler")
	db = config.GetDB()
}
