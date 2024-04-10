package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Cor struct {
	ID        uint   `json:"id"`
	Descricao string `json:"descricao"`
	Codigo    int    `json:"codigo" gorm:"primaryKey"`
}

type Produto struct {
	ID                uint    `json:"id"`
	Descricao         string  `json:"descricao"`
	CodigoBarra       int     `json:"codigoBarra"`
	CodigoBarraArezzo int     `json:"codigoBarraArezzo"`
	Referencia        int     `json:"referencia"`
	CorProdutoCodigo  int     `json:"corProdutoCodigo"`
	Cor               Cor     `json:"cor,omitempty" gorm:"foreignKey:CorProdutoCodigo;references:Codigo"`
	Secao             Secao   `json:"secao,omitempty" gorm:"foreignKey:CodigoBarra;references:CodigoBarra"`
	Valor             float64 `json:"valor"`
}

// @BasePath /api/v1

// @Summary List Produto
// @Description List Produto
// @Tags Produto
// @Accept json
// @Produce json
// @Param request body ShowProdutoHandler true "Request body"
// @Success 200 {object} ShowProdutoResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /showProduto [get]
func ShowProdutoHandler(ctx *gin.Context) {

	codigoBarra := ctx.Query("codigoBarra")
	if codigoBarra == "" {
		sendError(ctx, http.StatusInternalServerError, "para a busca e necessario o codigo de barras")
		return
	}
	codigo, err := strconv.Atoi(codigoBarra)

	if err != nil {
		sendError(ctx, http.StatusInternalServerError, "na conversao do codigo de barras")
		return
	}

	listProduto := Produto{}

	if err := db.Where("codigo_barra = ?", codigo).Preload("Cor").Preload("Secao").First(&listProduto).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "error na busca do produto")
		return
	}

	sendSuccess(ctx, "listado-Produto", listProduto)

}
