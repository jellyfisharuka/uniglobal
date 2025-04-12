package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Letter struct {
	ID           uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID       uint           `json:"user_id"`
	LetterType   string         `json:"letter_type"`
	Program      string         `json:"program"`
	Subjects     string         `json:"subjects"`
	Achievements string         `json:"achievements"`
	Skills       string         `json:"skills"`
	Goals        string         `json:"goals"`
	Content      string         `json:"content" gorm:"type:text"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}
