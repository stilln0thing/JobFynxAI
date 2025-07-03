package service

import (
	"context"
	"errors"
	"time"
	"github.com/stilln0thing/JobFynxAI/backend/internal/models"
	"github.com/stilln0thing/JobFynxAI/backend/internal/repository"
)

type interviewService struct {
	interviewRepo repository.InterviewRepository
}

func NewInterviewService(interviewRepo repository.InterviewRepository) InterviewService {
	return &interviewService{
		interviewRepo: interviewRepo,
	}
}

func (s *interviewService) ScheduleInterview(ctx context.Context, interview *models.Interview) error {
	// Validate interview time 
	if interview.StartTime.Before(time.Now()){
		return errors.New("interview cannot be scheduled in the past")
	}

	//set initial status
	interview.Status = "scheduled"
	
	return s.interviewRepo.Create(ctx, interview)
}

func (s *interviewService) StartInterview(ctx context.Context, interviewID uint) error {
	interview, err := s.interviewRepo.GetByID(ctx, interviewID)
	if err !=nil{
		return err
	}
	if interview.Status != "scheduled" {
		return errors.New("interview cannot be started")
	}
	interview.Status = "in_progress"
	interview.StartTime = time.Now()

	return s.interviewRepo.Update(ctx, interview)
}

func (s *interviewService) EndInterview(ctx context.Context, interviewID uint) error {
    interview, err := s.interviewRepo.GetByID(ctx, interviewID)
    if err != nil {
        return err
    }

    if interview.Status != "in_progress" {
        return errors.New("interview is not in progress")
    }

    interview.Status = "completed"
    interview.EndTime = time.Now()
    
    return s.interviewRepo.Update(ctx, interview)
}

func (s *interviewService) GetInterview(ctx context.Context, interviewID uint) (*models.Interview, error) {
    return s.interviewRepo.GetByID(ctx, interviewID)
}

func (s *interviewService) GetUserInterviews(ctx context.Context, userID uint) ([]*models.Interview, error) {
    return s.interviewRepo.GetByUserID(ctx, userID)
}