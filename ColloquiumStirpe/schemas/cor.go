package schemas

type CorProduto struct {
	Descricao string
	Codigo    int
}

type ProdutoCorResponse struct {
	ID        uint   `json:"id"`
	Descricao string `json:"descricao"`
	Codigo    int    `json:"codigo"`
}
