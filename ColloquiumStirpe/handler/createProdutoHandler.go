package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
	"github.com/guilhermediasm/colloquiumStirpe/schemas"
	"gorm.io/gorm"
)

// @BasePath /api/v1

// @Summary Create Produto
// @Description Create a new product
// @Tags Produto
// @Accept json
// @Produce json
// @Param request body CreateProdutoRequest true "Request body"
// @Success 200 {object} CreateProdutoResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /cadastrarProduto [post]
func CreateProdutoHandler(ctx *gin.Context) {
	var request CreateProdutoRequest
	if err := ctx.BindJSON(&request); err != nil {
		handleError(ctx, http.StatusBadRequest, "BindJSON error: %v", err)
		return
	}

	if err := request.Validate(); err != nil {
		handleError(ctx, http.StatusBadRequest, "validation error: %v", err)
		return
	}

	var cor Cor
	if err := db.Where(&Cor{Codigo: request.CorProdutoCodigo}).First(&cor).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			sendError(ctx, http.StatusFound, "Essa cor não foi encontrada, favor verificar na seção Cadastrar Cor")
			return
		}
		handleError(ctx, http.StatusBadRequest, "cor do produto não encontrado", err)
		return
	}

	produto := schemas.Produto{
		CodigoBarra:       request.CodigoBarra,
		CodigoBarraArezzo: request.CodigoBarraArezzo,
		CorProdutoCodigo:  request.CorProdutoCodigo,
		Descricao:         request.Descricao,
		Referencia:        request.Referencia,
		Valor:             request.Valor,
	}

	if err := db.Where(&schemas.Produto{CodigoBarra: request.CodigoBarra}).First(&schemas.Produto{}).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			if result := db.Create(&produto); result.Error != nil {
				handleCreateError(ctx, result.Error)
				return
			}
			sendSuccess(ctx, "Produto adicionado com sucesso!\n Agora ele poderar ser adicionado ao inventário", produto)
			return
		}
		handleError(ctx, http.StatusInternalServerError, "error creating Produto: %v", err)
		return
	}

	msg := fmt.Sprintf("O código de barra %v, já está cadastrado", request.CodigoBarra)
	sendError(ctx, http.StatusConflict, msg)
}

func handleCreateError(ctx *gin.Context, err error) {
	msg := "error creating Produto"
	if mysqlErr, ok := err.(*mysql.MySQLError); ok {
		switch mysqlErr.Number {
		case 1452:
			msg = fmt.Sprintf("%s: %s", msg, gorm.ErrForeignKeyViolated.Error())
		}
	}
	handleError(ctx, http.StatusInternalServerError, msg, err)
}

func handleError(ctx *gin.Context, status int, format string, err error) {
	logger.Errorf(format, err)
	sendError(ctx, status, fmt.Sprintf(format, err))
}
