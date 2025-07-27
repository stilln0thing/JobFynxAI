package main

import (
	"errors"
	
	"log/slog"
	"net/http"
	"os"
	"github.com/joho/godotenv"
	"github.com/stilln0thing/JobFynxAI/server/internal/controller"
	"github.com/stilln0thing/JobFynxAI/server/internal/core"
	"github.com/stilln0thing/JobFynxAI/server/internal/database"
	
	router "github.com/stilln0thing/JobFynxAI/server/internal/routes"
	"github.com/stilln0thing/JobFynxAI/server/internal/services"
)

func main(){
	//Load config
	slog.Info("server exec")

	cfg,err := core.LoadConfig()
	if err != nil{
		slog.Error("Failed to load config:", err)
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
		slog.Error("Failed to initialise database:", err)
	}
	if err := godotenv.Load(); err != nil {
    	slog.Error("warning: no .env file loaded: %v", err)
  	}
	LIVEKIT_URL := os.Getenv("LIVEKIT_URL")
	LIVEKIT_API_KEY := os.Getenv("LIVEKIT_API_KEY")
	LIVEKIT_API_SECRET := os.Getenv("LIVEKIT_API_SECRET")
	OPENAI_API_KEY := os.Getenv("OPENAI_API_KEY")
	OPENAI_RESUME_SUMMARY_MODEL := os.Getenv("OPENAI_RESUME_SUMMARY_MODEL")
	OPENAI_EVALUATE_INTERVIEW_MODEL := os.Getenv("OPENAI_EVALUATE_INTERVIEW_MODEL")
	MINIO_ENDPOINT := os.Getenv("MINIO_ENDPOINT")
	MINIO_ROOT_USER := os.Getenv("MINIO_ROOT_USER")
	MINIO_ROOT_PASSWORD := os.Getenv("MINIO_ROOT_PASSWORD")
	MINIO_RESUME_BUCKET := os.Getenv("MINIO_RESUME_BUCKET")
	slog.Info("hey1")
	interviewRepo := database.NewInterviewRepository()
	userService := services.NewUserService()

	roomService := services.NewRoomService(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
	resumeService := services.NewResumeService(OPENAI_API_KEY, OPENAI_RESUME_SUMMARY_MODEL)
	evaluationService := services.NewEvaluationService(OPENAI_API_KEY, OPENAI_EVALUATE_INTERVIEW_MODEL)
	objectStorageService, err := services.NewObjectStorageService(MINIO_ENDPOINT, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, MINIO_RESUME_BUCKET)
	slog.Info(MINIO_ENDPOINT)
	if err != nil {
		slog.Error(err.Error())
		return
	}
	
	interviewService := services.NewInterviewService(interviewRepo, resumeService, evaluationService, objectStorageService)
	connectionService := services.NewConnectionService(roomService, interviewService)

	userController := controller.NewUserController(userService)
	connectionController := controller.NewConnectionController(connectionService)
	uploadController := controller.NewUploadController()
	interviewController := controller.NewInterviewController(interviewService)
	apiRouter := router.New(connectionController, uploadController, userController, interviewController)
	address := cfg.Server.Port
	server := &http.Server{
		Addr:    ":" +address,
		Handler: apiRouter,
	}
	slog.Info("Started server at :" + address)
	if err := server.ListenAndServe(); err != nil {
		if errors.Is(err, http.ErrServerClosed) {
			slog.Info("Server closed under request")
		} else {
			slog.Error("Server closed unexpectedly : " + err.Error())
		}
	}
}

