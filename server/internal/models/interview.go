package models

import (
	"time"
)

type Interview struct {
	ID            string              `gorm:"primaryKey" json:"id"`
	UserID        string              `gorm:"not null" json:"user_id"`
	UserName      string              `json:"userName"`
	Status        string              `gorm:"default:'scheduled'" json:"status"`
	ResumePath    string              `json:"resumePath"`
    ResumeID      string              `json:"resume_id"` // foreign key
    ResumeSummary *Resume             `gorm:"foreignKey:ResumeID" json:"resumeSummary"`
	Questions     []QuestionPrep      `gorm:"-" json:"questions"`
	Transcript    []TranscriptMessage `gorm:"-" json:"transcript"` // interview transcript
	EvaluationID   string              `json:"evaluation_id"`       // foreign key
	Evaluation    *Evaluation          `gorm:"foreignKey:EvaluationID" json:"evaluation"`    // AI Evaluation
	CreatedAt     time.Time           `json:"created_at"`
}

type TranscriptMessage struct {
	Role      string  `json:"role"`
	Content   string  `json:"content"`
	CreatedAt float64 `json:"created_at"`
}

type Evaluation struct {
	ID				  string            `gorm:"primaryKey" json:"id"`
	Recommendation      string            `json:"recommendation"`
	OverallRating       float32           `json:"overallRating"`
	OverallFeedback     string            `json:"overallFeedback"`
	TechnologiesRating  float32           `json:"technologiesRating"`
	ProjectsRating      float32           `json:"projectsRating"`
	CommunicationRating float32           `json:"communicationRating"`
	EvaluationItems     []EvaluationItems `gorm:"-" json:"evaluationItems"`
}

type EvaluationItems struct {
	Question   string   `json:"question"`
	Answer     string   `json:"answer"`
	Rating     float32  `json:"rating"`
	Guidelines []string `gorm:"-" json:"guidelines"`
}