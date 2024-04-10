package handler

import (
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// @BasePath /api/v1

// @Summary List Cor
// @Description List Cor
// @Tags Cor
// @Accept json
// @Produce json
// @Param request body ShowCorRequest true "Request body"
// @Success 200 {object} ShowCorResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /showCor [get]
func ShowCorHandler(ctx *gin.Context) {

	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))

	perPage := 10
	var total int64

	offset := (page - 1) * perPage

	listCor := []Cor{}

	if err := db.Limit(perPage).Offset(offset).Find(&listCor).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "error show cor")
		return
	}

	sendSuccessPagination(ctx, "cores listados com sucesso", listCor, total, page, math.Ceil(float64(total)/float64(perPage)))
}
