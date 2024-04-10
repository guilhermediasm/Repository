package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/guilhermediasm/colloquiumStirpe/model"
	"gorm.io/gorm"
)

// @BasePath /api/v1

// @Summary Create Cor
// @Description Create a new product
// @Tags Cor
// @Accept json
// @Produce json
// @Param request body CreateCorRequest true "Request body"
// @Success 200 {object} CreateCorResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /cadastrarCor [post]
func CreateCorHandler(ctx *gin.Context) {
	request := CreateCorRequest{}

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

	cor := model.Cor{
		Codigo:    request.Codigo,
		Descricao: request.Descricao,
	}

	if err := db.Where(&model.Cor{Codigo: request.Codigo}).First(&model.Cor{}).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			if result := db.Create(&cor); result.Error != nil {
				handleCreateError(ctx, result.Error)
				return
			}
			sendSuccess(ctx, "Cor adicionado com sucesso!\n Agora poderar ser adicionado para cadastrar os produtos", cor)
			return
		}
		msg := fmt.Sprintf("A cor %v, já esta cadastrada", request.Codigo)
		handleError(ctx, http.StatusInternalServerError, msg, err)
		return
	}
}
