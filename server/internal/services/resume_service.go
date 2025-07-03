package service

import (
	"context"
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
	"github.com/stilln0thing/JobFynxAI/server/internal/repository"
)

type resumeService struct {
	resumeRepo repository.ResumeRepository
}

func NewResumeService(resumeRepo repository.ResumeRepository) ResumeService {
	return &resumeService{
		resumeRepo: resumeRepo,
	}
}

func (s *resumeService) UploadResume(ctx context.Context, userID uint, fileURL string) error {
	resume := &models.Resume{
		UserID: userID,
		FileURL: fileURL,
	}
	return s.resumeRepo.Create(ctx, resume)
}

func (s *resumeService) GetResume(ctx context.Context, userID uint) (*models.Resume, error) {
	return s.resumeRepo.GetByUserID(ctx, userID)
}

func (s *resumeService) UpdateResume(ctx context.Context, resume *models.Resume) error {
	return s.resumeRepo.Update(ctx, resume)
}

func (s *resumeService) DeleteResume(ctx context.Context, userID uint) error {
	resume, err := s.resumeRepo.GetByUserID(ctx, userID)
	if err != nil {
		return err
	}
	return s.resumeRepo.Delete(ctx, resume.ID)
}