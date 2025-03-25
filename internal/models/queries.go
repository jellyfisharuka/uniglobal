package models

import "time"

type Query struct {
	Question string
	Answer   string
	User     User
}

type Chat struct {
	ID       int       `gorm:"primaryKey"`
	UserID   int       `gorm:"not null"`
	Messages []Message `gorm:"foreignKey:ChatID"`
}

type Message struct {
	ID        uint      `gorm:"primaryKey"`
	ChatID    uint      `gorm:"not null"`
	Prompt    string    `gorm:"type:text;not null"`
	Answer    string    `gorm:"type:text;not null"`
	SenderID  uint      `gorm:"not null"` 
	CreatedAt time.Time `gorm:"autoCreateTime"`
	IsLiked bool `gorm:"is_liked"` //liked gpt answer for user favs 
}

type MessageSwagger struct {
    ChatID  int    `json:"chatID"`  // The ID of the chat
    Prompt  string `json:"prompt"`  // The message content (input from user)
}