package repository

import (
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
	
)
type InterviewRepository interface {
	CreateInterview(id uint, username string, resumePath string)(*models.Interview,error)
    GetInterview( id uint) (*models.Interview, error)
    GetAllInterviews() ([]*models.Interview, error)
    UpdateEvaluation(id uint,evaluation *models.Evaluation) error

}
