package model

import "gorm.io/gorm"

// Representa um Produto no estoque
type Produto struct {
	gorm.Model
	Descricao         string  `json:"descricao"`
	CodigoBarra       int     `json:"codigoBarra" gorm:"uniqueIndex:idx_CodigoBarra"`
	CodigoBarraArezzo int     `json:"codigoBarraArezzo" gorm:"uniqueIndex:idx_CodigoBarraArezzo"`
	Referencia        int     `json:"referencia"`
	CorProdutoCodigo  int     `json:"corProdutoCodigo"`
	Cor               Cor     `json:"cor,omitempty" gorm:"foreignKey:CorProdutoCodigo;references:Codigo"`
	Secao             Secao   `json:"secao,omitempty" gorm:"foreignKey:CodigoBarra;references:CodigoBarra"`
	Valor             float64 `json:"valor"`
}
