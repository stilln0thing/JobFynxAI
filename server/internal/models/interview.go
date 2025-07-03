package models

import (
	"time"
)

type Interview struct {
	ID            uint                 `gorm:"primaryKey" json:"id"`
	UserID	      uint                 `gorm:"not null" json:"user_id"`
	UserName      string               `json:"userName"`
	Status        string               `gorm:"default:'scheduled'" json:"status"` 
	ResumePath    string               `json:"resumePath"`
	ResumeSummary *Resume              `json:"resumeSummary"`
	// Questions  *[]QuestionPrep      `json:"questions"`
	Transcript    *[]TranscriptMessage `json:"transcript"`  // interview transcript
	Evaluation    *Evaluation          `json:"evaluation"`   // AI Evaluation
	CreatedAt     time.Time            `json:"created_at"`	
}

type TranscriptMessage struct {
	Role      string  `json:"role"`
	Content   string  `json:"content"`
	CreatedAt float64 `json:"created_at"`
}

type Evaluation struct {
	Recommendation			string				`json:"recommendation"`
	OverallRating			float32				`json:"overallRating"`
	OverallFeedback			string				`json:"overallFeedback"`
	TechnologiesRating 		float32				`json:"technologiesRating"`
	ProjectsRating			float32				`json:"projectsRating"`
	CommunicationRating		float32				`json:"communicationRating"`
	EvaluationItems			*[]EvaluationItems	`json:"evaluationItems"`
}

type EvaluationItems struct {
	Question			string 			`json:"question"`
	Answer 				string 			`json:"answer"`
	Rating 				float32			`json:"rating"`
	Guidelines 			[]string		`json:"guidelines"`
}