package services

import (
	"errors"
	"os"
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
)

type UserService struct{}

func NewUserService() *UserService {
	return &UserService{}
}

func (U *UserService) Login(username string, password string) (*models.LoginResponse, error) {
	SERVER_ADMIN_USERNAME := os.Getenv("SERVER_ADMIN_USERNAME")
	SERVER_ADMIN_PASSWORD := os.Getenv("SERVER_ADMIN_PASSWORD")
	SERVER_USER_PASSWORD := os.Getenv("SERVER_USER_PASSWORD")

	if username == SERVER_ADMIN_USERNAME && password == SERVER_ADMIN_PASSWORD{
		return &models.LoginResponse{Username: username, Role: "admin"}, nil
	}
	if password == SERVER_USER_PASSWORD{
		return &models.LoginResponse{Username: username, Role: "user"}, nil
	}
	return nil, errors.New("user not available")
}