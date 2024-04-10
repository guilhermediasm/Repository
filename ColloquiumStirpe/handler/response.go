package handler

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/guilhermediasm/colloquiumStirpe/schemas"
)

func sendError(ctx *gin.Context, code int, msg string) {
	ctx.Header("Content-type", "application/json")
	ctx.JSON(code, gin.H{
		"message":   msg,
		"errorCode": code,
	})
}

func sendSuccess(ctx *gin.Context, op string, data interface{}) {
	ctx.Header("Content-type", "application/json")
	ctx.JSON(200, gin.H{
		"message": fmt.Sprintf("%s successfull", op),
		"data":    data,
	})
}

func sendSuccessPagination(ctx *gin.Context, op string, data interface{}, total int64, page int, lastPage float64) {
	ctx.Header("Content-type", "application/json")
	ctx.JSON(200, gin.H{
		"message":  fmt.Sprintf("%s successfull", op),
		"data":     data,
		"total":    total,
		"page":     page,
		"lastPage": lastPage,
	})
}

type ErrorResponse struct {
	Message   string `json:"message"`
	ErrorCode string `json:"errorCode"`
}

type CreateProdutoResponse struct {
	Message string                  `json:"message"`
	Data    schemas.ProdutoResponse `json:"data"`
}

type DeleteProdutoResponse struct {
	Message string                  `json:"message"`
	Data    schemas.ProdutoResponse `json:"data"`
}
type ShowProdutoResponse struct {
	Message string                  `json:"message"`
	Data    schemas.ProdutoResponse `json:"data"`
}
type ListItemsResponse struct {
	Message string                    `json:"message"`
	Data    []schemas.ProdutoResponse `json:"data"`
}
type UpdateProdutoResponse struct {
	Message string                  `json:"message"`
	Data    schemas.ProdutoResponse `json:"data"`
}
