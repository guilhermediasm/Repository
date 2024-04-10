package handler

import (
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type SecaoQuantidade struct {
	NumeroSecao int

	Quantidade int
}

type Secao struct {
	NumeroSecao int
	CodigoBarra int
	Quantidade  int
}

// @BasePath /api/v1

// @Summary List Secao
// @Description List secao
// @Tags Secao
// @Accept json
// @Produce json
// @Param request body ShowSecaoRequest true "Request body"
// @Success 200 {object} ShowSecaoResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /showSecao [get]
func ShowSecaoHandler(ctx *gin.Context) {

	secao := ctx.Query("secao")
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))

	perPage := 10
	var total int64

	offset := (page - 1) * perPage

	if secao == "" {
		secaoQuantidade := []SecaoQuantidade{}

		if err := db.Raw("SELECT numero_secao, SUM(quantidade) as quantidade FROM secaos GROUP BY numero_secao").Scan(&secaoQuantidade).Error; err != nil {
			sendError(ctx, http.StatusInternalServerError, "error show quantidade na secoes")
			return
		}

		sendSuccess(ctx, "listado-Secao", secaoQuantidade)
		return
	}

	listSecao := []Secao{}

	if err := db.Where("numero_secao = ?", secao).Limit(perPage).Offset(offset).Preload("Cor").Find(&listSecao).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "error show quantidade na secoes")
		return
	}

	sendSuccessPagination(ctx, "produtos listados com sucesso", listSecao, total, page, math.Ceil(float64(total)/float64(perPage)))

}
