package repository

import (
	"uniglobal/internal/models"

	"gorm.io/gorm"
)

type ChatRepository struct {
    DB *gorm.DB
}

func (r *ChatRepository) CreateChat(chat *models.Chat) error {
    return r.DB.Create(chat).Error
}

func (r *ChatRepository) GetChatByID(id int) (models.Chat, error) {
    var chat models.Chat
    err := r.DB.Preload("Messages").First(&chat, id).Error
    return chat, err
}

func (r *ChatRepository) UpdateChat(chat *models.Chat) error {
    return r.DB.Save(chat).Error
}

func (r *ChatRepository) DeleteChat(id uint) error {
    return r.DB.Delete(&models.Chat{}, id).Error
}

func (r *ChatRepository) GetAllChats() ([]models.Chat, error) { //for admins
    var chats []models.Chat
    err := r.DB.Preload("Messages").Find(&chats).Error
    return chats, err
}

func (r *ChatRepository) GetAllChatsForUser(userID int) ([]models.Chat, error) {
    var chats []models.Chat
    err := r.DB.Preload("Messages").Where("user_id = ?", userID).Find(&chats).Error
    return chats, err
}

func (r *ChatRepository) AddMessageToChat(message *models.Message) error {
    return r.DB.Create(message).Error
}