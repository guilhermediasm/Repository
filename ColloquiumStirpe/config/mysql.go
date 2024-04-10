package config

import (
	"github.com/guilhermediasm/colloquiumStirpe/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func InitializeDataBase() (*gorm.DB, error) {
	logger := GetLogger("mysql")
	dsn := "root:123@tcp(localhost:3306)/stirpe"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		logger.Errorf("opening error: %v", err)
	}

	db.AutoMigrate(&model.Cor{})
	db.AutoMigrate(&model.Secao{})
	db.AutoMigrate(&model.Produto{})

	return db, nil
}
