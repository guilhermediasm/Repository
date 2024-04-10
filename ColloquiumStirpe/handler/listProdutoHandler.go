package handler

import (
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// @BasePath /api/v1

// @Summary List Produto
// @Description List Produto
// @Tags Produto
// @Accept json
// @Produce json
// @Param request body ListProdutoHandler true "Request body"
// @Success 200 {object} ListProdutoResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /listProduto [get]
func ListProdutoHandler(ctx *gin.Context) {
	listProduto := []Produto{}

	codigoBarra, _ := strconv.Atoi(ctx.DefaultQuery("codigoBarra", "0"))
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))

	c := ctx.DefaultQuery("codigoBarra", "0")

	perPage := 15
	var total int64

	offset := (page - 1) * perPage

	if codigoBarra <= 0 && page == 1 {
		if err := db.Where(Produto{}).Limit(perPage).Offset(offset).Preload("Cor").Find(&listProduto).Count(&total).Error; err != nil {
			sendError(ctx, http.StatusInternalServerError, "error ao listar todos os produtos")
			return
		}

		sendSuccessPagination(ctx, "produtos listados com sucesso", listProduto, total, page, math.Ceil(float64(total)/float64(perPage)))
		return
	}

	if err := db.Where("codigo_barra LIKE ? OR codigo_barra_arezzo LIKE ?", "%"+c+"%", "%"+c+"%").Limit(perPage).Offset(offset).Preload("Cor").Find(&listProduto).Count(&total).Error; err != nil {

		sendError(ctx, http.StatusInternalServerError, "error ao listar todos os produtos")
		return
	}

	sendSuccessPagination(ctx, "produtos listados com sucesso", listProduto, total, page, math.Ceil(float64(total)/float64(perPage)))
}
