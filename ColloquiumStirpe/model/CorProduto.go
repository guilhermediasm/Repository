package model

import "gorm.io/gorm"

// Representa uma cor do Produto em estoque
type Cor struct {
	gorm.Model
	Descricao string `json:"descricao"`
	Codigo    int    `json:"codigo" gorm:"primaryKey"`
}
