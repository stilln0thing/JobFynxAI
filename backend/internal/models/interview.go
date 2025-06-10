package models

import (
	"time"
	"gorm.io/gorm"
)

type Interview struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	UserID	    uint           `gorm:"not null" json:"user_id"`
	Status      string         `gorm:"default:'scheduled'" json:"status"` 
	Type 	    string         `json:"type"` 
	StartTime   time.Time      `json:"start_time"`
	EndTime     time.Time      `json:"end_time"`
	RoomID	  string           `json:"room_id"`  //LiveKit Room ID
	AudioURL    string         `json:"audio_url"` //Recorded Interview audio
	Transcript  string         `json:"transcript"`  // interview transcript
	Evaluation   string        `json:"evaluation"`   // AI Evaluation
	CreatedAt   time.Time      `json:"created_at"`	
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}