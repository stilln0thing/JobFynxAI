package models

import (
	"time"
	"gorm.io/gorm"
)

type Resume struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	UserID     uint           `gorm:"not null" json:"user_id"` // Foreign key to User
	FileURL    string         `json:"file_url"` // URL to the resume file
	Summary    string         `json:"summary"` // Summary of the resume
	Skills     []string       `json:"skills"` 
	Experience []string       `json:"experience"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`		
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}