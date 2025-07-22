package controller

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	// "github.com/stilln0thing/JobFynxAI/server/internal/models"
	"github.com/stilln0thing/JobFynxAI/server/internal/services"
)

type InterviewController struct {
	InterviewService  *services.InterviewService
}

type RegisterRequest struct {
	Name     string `json:"name"`
	FileName string `json:"fileName"`
	FilePath string `json:"filePath"`
}

func NewInterviewController(interviewService *services.InterviewService) *InterviewController {
	return &InterviewController{InterviewService: interviewService}
}

func (this *InterviewController) Register() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error":"Invalid JSON"})
			return
		}
		interview, err := this.InterviewService.Register(req.Name, req.FileName, req.FilePath)
		if err != nil {
			slog.Error(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to register"})
			return
		}
		c.JSON(http.StatusOK, interview)
	}
}

func (this *InterviewController) GetAllInterviews() gin.HandlerFunc {
	return func(c *gin.Context){
		interviews, err := this.InterviewService.GetAllInterviews()
		if err != nil {
			slog.Error(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get all interviews"})
			return
		}
		c.JSON(http.StatusOK, interviews)
	}
}

func (this *InterviewController) GetInterview() gin.HandlerFunc {
	return func(c *gin.Context) {
		interviewId := c.Param("id")
		interview, err := this.InterviewService.GetInterview(interviewId)
		if err != nil {
			slog.Error(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get the interview"})
			return
		}
		c.JSON(http.StatusOK, interview)
	}
}

func (this *InterviewController) EvaluateInterview() gin.HandlerFunc {
	return func(c *gin.Context) {
		interviewId := c.Param("id")
		interview, err := this.InterviewService.EvaluateInterview(interviewId)
		if err != nil {
			slog.Error(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to evaluate interview"})
			return
		}
		c.JSON(http.StatusOK, interview)
	}
}