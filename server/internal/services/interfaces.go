package service

import (
	"context"
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
)

type UserService interface{
	Register(ctx context.Context, user *models.User) error
	Login(ctx context.Context, email, password string) (string,error)
	GetProfile(ctx context.Context, userID uint) (*models.User, error)
	UpdateProfile(ctx context.Context, user *models.User) error
}

type InterviewService interface {

	StartInterview(ctx context.Context, interviewID uint) error
	EndInterview(ctx context.Context, interviewID uint) error
	GetInterview(ctx context.Context, interviewID uint) (*models.Interview,error)
	GetUserInterviews(ctx context.Context, userID uint) ([]*models.Interview, error)
}

type ResumeService interface {
	UploadResume(ctx context.Context, userID uint, fileURL string) error
	GetResume(ctx context.Context, userID uint) (*models.Resume, error)
	UpdateResume(ctx context.Context, resume *models.Resume) error
	DeleteResume(ctx context.Context, userID uint ) error
}