package controller

import (
	
	"net/http"

	"github.com/gin-gonic/gin"
	
	"github.com/stilln0thing/JobFynxAI/server/internal/services"
)

type UserController struct {
	UserService *services.UserService
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Username string `json:"username"`
	Role     string `json:"role"`
}

func NewUserController (userService *services.UserService) *UserController{
	return &UserController{UserService: userService}
}

func (this *UserController) Login() gin.HandlerFunc{
	return func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			return
		}
		loginResponse, err := this.UserService.Login(req.Username, req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
		}
		c.JSON(http.StatusOK, loginResponse)
	}
}