package main

import (
	"log"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/stilln0thing/JobFynxAI/backend/internal/core/config"
	"github.com/stilln0thing/JobFynxAI/backend/internal/core/database"
	"github.com/stilln0thing/JobFynxAI/backend/internal/repository" 
	"github.com/stilln0thing/JobFynxAI/backend/internal/services"   
)

func main(){
	//Load config
	cfg,err := config.LoadConfig()
	if err != nil{
		log.Fatal("Failed to load config:", err)
	}

	// Initialise DB
	err = database.InitDB(
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.Username,
		cfg.Database.Password,
		cfg.Database.DBName,
	)
	if err != nil{
		log.Fatal("Failed to initialise database:", err)
	}
	repos := repository.NewRepositoryFactory()

	services := service.NewServiceFactory(repos)
    
	fmt.Println(services)
	router := gin.Default()

	router.GET("/health",func(c *gin.Context){
		c.JSON(200,gin.H{
			"status": "ok",
			"message": "Server is running",
		})
	})

	if err := router.Run(":"+cfg.Server.Port); err !=nil{
		log.Fatal("Failed to start server:", err)
	}
}

