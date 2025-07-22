package controller

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
	"github.com/stilln0thing/JobFynxAI/server/internal/services"
)

type ConnectionController struct {
	ConnectionService *services.ConnectionService
}

type ConnectionRequest struct {
	Username      string		 `json:"username"`
	ResumeSummary models.Resume  `json:"resumeSummary"`
	InterviewId   string 		 `json:"interviewId"`
}

type ConnectionResponse struct {
	Token string `json:"token"`
}

type DisconnectRequest struct {
	RoomName string `json:"roomName"`
	UserId   string `json:"userId"`
}

type DisconnectResponse struct {
	Error string `json:"error"`
}

func NewConnectionController(connectionService *services.ConnectionService) *ConnectionController {
	return &ConnectionController{ConnectionService: connectionService}
}

func (this *ConnectionController) Connect() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req ConnectionRequest
		if err := c.ShouldBindJSON(&req); err != nil{
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			return
		}
		token, err := this.ConnectionService.Connect(req.InterviewId)
		if err != nil{
			c.JSON(http.StatusInternalServerError, "error")
		}
		c.JSON(http.StatusOK, &ConnectionResponse{Token: token})
	}
}

func (this *ConnectionController) Disconnect() gin.HandlerFunc {
	return func(c *gin.Context) {
		var disreq DisconnectRequest
		if err := c.ShouldBindJSON(&disreq); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			return
		}
		err := this.ConnectionService.Disconnect(disreq.RoomName, disreq.UserId)
		if err != nil{
			slog.Error(err.Error())
			c.JSON(http.StatusInternalServerError, &DisconnectResponse{Error: "Unable to disconnect."})
			return
		}
		c.JSON(http.StatusOK, &DisconnectResponse{Error: ""})
	}
}