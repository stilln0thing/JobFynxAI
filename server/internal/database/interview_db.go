package database

import (
	"time"

	"github.com/stilln0thing/JobFynxAI/server/internal/models"
	"gorm.io/gorm"
)

type interviewRepository struct {
	db *gorm.DB
}

func NewInterviewRepository() *interviewRepository {
	return &interviewRepository{
		db: GetDB(),
	}
}

func (r *interviewRepository) CreateInterview(id string, username string, resumePath string) (*models.Interview, error) {
	query := `INSERT INTO INTERVIEWS(ID, USER_ID, USER_NAME, CREATED_AT, STATUS, RESUME_PATH) VALUES($1, $2, $3, $5, $6)`
	interview := &models.Interview{
		ID:         id,
		UserID:     "4a059408-0a27-4ca3-88d9-ca5f82db5dda",
		UserName:   username,
		CreatedAt:  time.Now(),
		Status:     "REGISTERED",
		ResumePath: resumePath,
	}
	tx := r.db.Exec(query, interview.ID, interview.UserID, interview.UserName, interview.CreatedAt, interview.Status, interview.ResumePath)
	if tx.Error != nil {
		return nil, tx.Error
	}
	return interview, nil
}

func (r *interviewRepository) GetAllInterviews() ([]*models.Interview, error) {
	query := `SELECT ID, USER_NAME, DATE_TRUNC('second', CREATED_AT::timestamp), STATUS, RESUME_PATH FROM INTERVIEWS ORDER BY CREATED_AT DESC`
	interviews := []*models.Interview{}
	if err := r.db.Raw(query).Scan(&interviews).Error; err != nil {
		return nil, err
	}
	return interviews, nil
}

func (r *interviewRepository) GetInterview(id string) (*models.Interview, error) {
	query := `SELECT INTERVIEW_ID, USERNAME, DATE_TRUNC('second', CREATED_AT::timestamp), STATUS, RESUME_PATH, RESUME_SUMMARY, TRANSCRIPT, EVALUATION FROM INTERVIEWS WHERE INTERVIEW_ID=$1`
	var interview models.Interview
	if err := r.db.Raw(query, id).Scan(&interview).Error; err != nil {
		return nil, err
	}
	return &interview, nil
}

func (r *interviewRepository) UpdateEvaluation(id string, evaluation *models.Evaluation) error {
	tx := r.db.
		Model(&models.Interview{}).
		Where("interview_id = ?", id).
		Update("evaluation", evaluation) // GORM will json.Marshal internally
	return tx.Error
}
