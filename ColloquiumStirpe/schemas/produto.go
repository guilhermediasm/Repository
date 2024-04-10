package schemas

type Produto struct {
	ID                uint    `json:"id"`
	Descricao         string  `json:"descricao"`
	CodigoBarra       int     `json:"codigoBarra"`
	CodigoBarraArezzo int     `json:"codigoBarraArezzo"`
	Referencia        int     `json:"referencia"`
	CorProdutoCodigo  int     `json:"CorProdutoCodigo"`
	Valor             float64 `json:"valor"`
}

type ProdutoResponse struct {
	ID                uint    `json:"id"`
	Descricao         string  `json:"descricao"`
	CodigoBarra       int     `json:"codigoBarra"`
	CodigoBarraArezzo int     `json:"codigoBarraArezzo"`
	Referencia        int     `json:"referencia"`
	Valor             float64 `json:"valor"`
}
