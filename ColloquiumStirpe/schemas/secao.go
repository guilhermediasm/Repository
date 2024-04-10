package schemas

type Secao struct {
	NumeroSecao int
	CodigoBarra int
	Quantidade  int
}

type SecaoResponse struct {
	ID          uint `json:"id"`
	NumeroSecao int  `json:"numeroSecao"`
	CodigoBarra int  `json:"codigoBarra"`
	Quantidade  int  `json:"quantidade"`
}
