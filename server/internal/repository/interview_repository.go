package repository

import (
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
	
)
type InterviewRepository interface {
	CreateInterview(id string, username string, resumePath string)(*models.Interview,error)
    GetInterview( id string) (*models.Interview, error)
    GetAllInterviews() ([]*models.Interview, error)
    UpdateEvaluation(id string,evaluation *models.Evaluation) error

}
