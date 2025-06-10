package main

import(
	"log"
	"github.com/gin-gonic/gin"
)

func main(){
	router := gin.Default()

	router.GET("/health",func(c *gin.Context){
		c.JSON(200,gin.H{
			"status": "ok",
			"message": "Server is running",
		})
	})

	if err := router.Run(":8080"); err !=nil{
		log.Fatal("Failed to start server:", err)
	}
}