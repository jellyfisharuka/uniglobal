package models

import "time"

type Query struct {
	Question string
	Answer   string
	User     User
}
type Chat struct {
	ID       int       `gorm:"primaryKey" json:"id"`
	UserID   int       `gorm:"not null" json:"user_id"`
	Messages []Message `gorm:"foreignKey:ChatID" json:"messages"`
}

type Message struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ChatID    uint      `gorm:"not null" json:"chat_id"`
	Prompt    string    `gorm:"type:text;not null" json:"prompt"`
	Answer    string    `gorm:"type:text;not null" json:"answer"`
	SenderID  uint      `gorm:"not null" json:"sender_id"` // The ID of the user sending the message
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	IsLiked   bool      `gorm:"is_liked"`
}

type MessageSwagger struct {
	Prompt string `json:"prompt"` // The message content (input from user)
}
