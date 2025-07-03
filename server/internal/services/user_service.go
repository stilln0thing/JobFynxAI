package service

import (
	"context"
	"errors"
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
	"github.com/stilln0thing/JobFynxAI/server/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{
		userRepo: userRepo,
	}
}

func (s *userService) Register(ctx context.Context, user *models.User) error {
    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }
    user.Password = string(hashedPassword)

    // Create user
    return s.userRepo.Create(ctx, user)
}

func (s *userService) Login(ctx context.Context, email, password string) (string, error) {
    user, err := s.userRepo.GetByEmail(ctx, email)
    if err != nil {
        return "", errors.New("invalid credentials")
    }

    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
        return "", errors.New("invalid credentials")
    }

    // TODO: Generate JWT token
    return "dummy-token", nil
}

func (s *userService) GetProfile(ctx context.Context, userID uint) (*models.User, error) {
    return s.userRepo.GetByID(ctx, userID)
}

func (s *userService) UpdateProfile(ctx context.Context, user *models.User) error {
    return s.userRepo.Update(ctx, user)
}