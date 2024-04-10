package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/guilhermediasm/colloquiumStirpe/schemas"
)

type APIUser struct {
	CodigoBarra int
}

// @BasePath /api/v1

// @Summary Create Secao
// @Description Create a new product
// @Tags Secao
// @Accept json
// @Produce json
// @Param request body CreateSecaoRequest true "Request body"
// @Success 200 {object} CreateSecaoResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /cadastrarSecao [post]
func CreateSecaoHandler(ctx *gin.Context) {
	request := CreateSecaoRequest{}

	if err := ctx.BindJSON(&request); err != nil {
		logger.Errorf("BindJSON error: %v", err.Error())
		sendError(ctx, http.StatusBadRequest, err.Error())
		return
	}

	if err := request.Validate(); err != nil {
		logger.Errorf("validation error: %v", err.Error())
		sendError(ctx, http.StatusBadRequest, err.Error())
		return
	}

	codigoBarra := request.CodigoBarra

	if err := db.Where(&schemas.Produto{CodigoBarra: codigoBarra}).First(&schemas.Produto{}).Error; err != nil {
		logger.Errorf("buscar codigo de barra error: %v", err.Error())
		sendError(ctx, http.StatusBadRequest, "Código de barra não encontrado")
		return
	}

	var u schemas.Secao

	response := db.Where(&schemas.Secao{CodigoBarra: codigoBarra}).First(&u, 1)

	if response.Error != nil {
		Secao := schemas.Secao{
			NumeroSecao: request.NumeroSecao,
			CodigoBarra: request.CodigoBarra,
			Quantidade:  1,
		}

		if err := db.Create(&Secao).Error; err != nil {
			logger.Errorf("error adicionar na Seção: %v", err.Error())
			sendError(ctx, http.StatusInternalServerError, "error adicionar produto na seção")
			return
		}

	} else {

		Secao := schemas.Secao{
			NumeroSecao: request.NumeroSecao,
			CodigoBarra: request.CodigoBarra,
			Quantidade:  u.Quantidade + 1,
		}

		if err := db.Where(&schemas.Secao{CodigoBarra: codigoBarra}).Save(&Secao).Error; err != nil {
			logger.Errorf("error adicionar na Seção: %v", err.Error())
			sendError(ctx, http.StatusInternalServerError, "error ao atualizar produto na seção")
			return
		}
	}

	listSecao := []schemas.Secao{}

	if err := db.Find(&schemas.Secao{NumeroSecao: request.NumeroSecao}).Scan(&listSecao).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "error listing seção")
		return
	}

	sendSuccess(ctx, "adicionado-Secao", listSecao)

}
