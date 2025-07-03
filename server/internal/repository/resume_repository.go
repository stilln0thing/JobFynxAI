package repository

import (
	"context"
	"github.com/stilln0thing/JobFynxAI/server/internal/database"
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
	"gorm.io/gorm"
)

type resumeRepository struct {
	db *gorm.DB
}

func NewResumeRepository() ResumeRepository {
	return &resumeRepository{
		db : database.GetDB(),
	}
}

func (r *resumeRepository) Create(ctx context.Context, resume *models.Resume) error {
	return r.db.WithContext(ctx).Create(resume).Error
}

func (r *resumeRepository) GetByID(ctx context.Context, id uint) (*models.Resume, error) {
    var resume models.Resume
    err := r.db.WithContext(ctx).First(&resume, id).Error
    if err != nil {
        return nil, err
    }
    return &resume, nil
}

func (r *resumeRepository) GetByUserID(ctx context.Context, userID uint) (*models.Resume, error) {
    var resume models.Resume
    err := r.db.WithContext(ctx).Where("user_id = ?", userID).First(&resume).Error
    if err != nil {
        return nil, err
    }
    return &resume, nil
}

func (r *resumeRepository) Update(ctx context.Context, resume *models.Resume) error {
    return r.db.WithContext(ctx).Save(resume).Error
}

func (r *resumeRepository) Delete(ctx context.Context, id uint) error {
    return r.db.WithContext(ctx).Delete(&models.Resume{}, id).Error
}