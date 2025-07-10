package router

import(
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine){
	v1 := router.Group("/api/v1") 
	v1.GET("/health", func(c *gin.Context){
		c.JSON(200, gin.H{
			"status":  "ok",
		})
	})
	
}