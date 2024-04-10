package handler

import "fmt"

func errParamIsRequired(name, typ string) error {
	return fmt.Errorf("param: %s (type: %s) is required", name, typ)
}

// CreateProduto
type CreateProdutoRequest struct {
	Descricao         string  `json:"descricao"`
	CodigoBarra       int     `json:"codigoBarra"`
	CodigoBarraArezzo int     `json:"codigoBarraArezzo"`
	Referencia        int     `json:"referencia"`
	CorProdutoCodigo  int     `json:"corProdutoCodigo"`
	Valor             float64 `json:"valor"`
}

func (r *CreateProdutoRequest) Validate() error {
	if r.CodigoBarra <= 0 && r.Descricao == "" && r.Referencia <= 0 && r.CorProdutoCodigo <= 0 && r.Valor <= 0 {
		return fmt.Errorf("request body is empty or malformed")
	}
	if r.CodigoBarra <= 0 {
		return errParamIsRequired("CodigoBarra", "int")
	}
	if r.Descricao == "" {
		return errParamIsRequired("Descricao", "string")
	}
	if r.Referencia <= 0 {
		return errParamIsRequired("Referencia", "int")
	}
	if r.CorProdutoCodigo <= 0 {
		return errParamIsRequired("CorProdutoCodigo", "int")
	}
	if r.Valor <= 0 {
		return errParamIsRequired("Valor", "float")
	}
	return nil
}

// CreateCor
type CreateCorRequest struct {
	Codigo    int    `json:"codigo"`
	Descricao string `json:"descricao"`
}

func (r *CreateCorRequest) Validate() error {

	if r.Codigo < 0 || r.Descricao == "" {
		return fmt.Errorf("request body is empty or malformed")
	}
	if r.Codigo < 0 {
		return errParamIsRequired("Codigo", "int")
	}
	if r.Descricao == "" {
		return errParamIsRequired("Descricao", "string")
	}

	return nil
}

type CreateSecaoRequest struct {
	NumeroSecao int `json:"numeroSecao"`
	CodigoBarra int `json:"CodigoBarra"`
}

func (r *CreateSecaoRequest) Validate() error {

	if r.NumeroSecao < 0 || r.CodigoBarra < 0 {
		return fmt.Errorf("request body is empty or malformed")
	}
	if r.NumeroSecao < 0 {
		return errParamIsRequired("NumeroSecao", "int")
	}
	if r.CodigoBarra < 0 {
		return errParamIsRequired("CodigoBarra", "int")
	}

	return nil
}
