package router

import (
	"github.com/gin-gonic/gin"
	docs "github.com/guilhermediasm/colloquiumStirpe/docs"
	"github.com/guilhermediasm/colloquiumStirpe/handler"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func initializeRoutes(router *gin.Engine) {
	// Initialize Handler
	handler.InitializeHandler()
	basePath := "/api/v1"
	docs.SwaggerInfo.BasePath = basePath
	v1 := router.Group(basePath)
	{
		v1.POST("/cadastrarCor", handler.CreateCorHandler)
		v1.POST("/cadastrarProduto", handler.CreateProdutoHandler)
		v1.POST("/cadastrarSecao", handler.CreateSecaoHandler)
		v1.GET("/showSecao", handler.ShowSecaoHandler)
		v1.GET("/showProduto", handler.ShowProdutoHandler)
		v1.GET("/showCor", handler.ShowCorHandler)
		v1.GET("/listProduto", handler.ListProdutoHandler)

	}
	// Initialize Swagger
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
}
