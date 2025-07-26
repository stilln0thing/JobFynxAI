package main

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/stilln0thing/JobFynxAI/server/internal/controller"
	"github.com/stilln0thing/JobFynxAI/server/internal/core"
	"github.com/stilln0thing/JobFynxAI/server/internal/repository"
	router "github.com/stilln0thing/JobFynxAI/server/internal/routes"
	"github.com/stilln0thing/JobFynxAI/server/internal/services"
)

func main(){
	//Load config
	cfg,err := core.LoadConfig()
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
	
    
	

	if err := router.Run(":"+cfg.Server.Port); err !=nil{
		log.Fatal("Failed to start server:", err)
	}
}

