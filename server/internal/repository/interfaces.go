package repository

import (
	"context"
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
)

type UserRepository interface {
	Create(ctx context.Context, user *models.User) error
	GetByID(ctx context.Context, id uint) (*models.User, error)
    GetByEmail(ctx context.Context, email string) (*models.User, error)
    Update(ctx context.Context, user *models.User) error
    Delete(ctx context.Context, id uint) error
}

type InterviewRepository interface {
	Create(ctx context.Context, interview *models.Interview) error
    GetByID(ctx context.Context, id uint) (*models.Interview, error)
    GetByUserID(ctx context.Context, userID uint) ([]*models.Interview, error)
    Update(ctx context.Context, interview *models.Interview) error
    Delete(ctx context.Context, id uint) error
}

type ResumeRepository interface {
	Create(ctx context.Context, resume *models.Resume) error
	GetByID(ctx context.Context, id uint) (*models.Resume, error)
    GetByUserID(ctx context.Context, userID uint) (*models.Resume, error)
    Update(ctx context.Context, resume *models.Resume) error
    Delete(ctx context.Context, id uint) error
}