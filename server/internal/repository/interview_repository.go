package repository

import (
	"context"
	"github.com/stilln0thing/JobFynxAI/backend/internal/core/database"
	"github.com/stilln0thing/JobFynxAI/backend/internal/models"
	"gorm.io/gorm"
)

type interviewRepository struct {
	db *gorm.DB
}

func NewInterviewRepository() InterviewRepository {
	return &interviewRepository{
		db: database.GetDB(),
	}
}

func (r *interviewRepository) Create(ctx context.Context, interview *models.Interview) error {
	return r.db.WithContext(ctx).Create(interview).Error
}

func (r *interviewRepository) GetByID(ctx context.Context, id uint) (*models.Interview, error) {
    var interview models.Interview
    err := r.db.WithContext(ctx).First(&interview, id).Error
    if err != nil {
        return nil, err
    }
    return &interview, nil
}

func (r *interviewRepository) GetByUserID(ctx context.Context, userID uint) ([]*models.Interview, error) {
    var interviews []*models.Interview
    err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&interviews).Error
    if err != nil {
        return nil, err
    }
    return interviews, nil
}

func (r *interviewRepository) Update(ctx context.Context, interview *models.Interview) error {
    return r.db.WithContext(ctx).Save(interview).Error
}

func (r *interviewRepository) Delete(ctx context.Context, id uint) error {
    return r.db.WithContext(ctx).Delete(&models.Interview{}, id).Error
}