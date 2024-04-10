package model

import "gorm.io/gorm"

// Representa um Produto no estoque
type Secao struct {
	gorm.Model
	NumeroSecao int `json:"numeroSecao"`
	CodigoBarra int `gorm:"primaryKey" json:"codigoBarra"`
	Quantidade  int `json:"quantidade"`
}
