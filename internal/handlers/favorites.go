package handlers

import (
	"net/http"
	"uniglobal/internal/models"
    "uniglobal/internal/db"
	"github.com/gin-gonic/gin"
)

type LikeRequest struct {
    MessageID uint `json:"message_id"`
}

// @Security Bearer
// @Security GoogleOAuth
// @Summary Получить избранные ответы
// @Description Возвращает список сообщений, которые пользователь отметил как избранные (лайкнул)
// @Tags favorites
// @Security Bearer
// @Security GoogleOAuth
// @Produce json
// @Success 200 {array} models.Message "Список избранных сообщений"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Ошибка сервера"
// @Router /favorites [get]
func GetFavResponses(c *gin.Context) {
	userID, exists := c.Get("ID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	var messages []models.Message
	if err := db.DB.Where("sender_id = ? AND is_liked = ?", userID, true).Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch favorite messages"})
		return
	}
	answers := make([]string, len(messages))
	for i, msg := range messages {
		answers[i] = msg.Answer
	}

	c.JSON(http.StatusOK, answers)
	
}

// @Security Bearer
// @Security GoogleOAuth
// @Summary Поставить или убрать лайк у сообщения
// @Description Инвертирует статус лайка у сообщения пользователя (лайк/убрать лайк)
// @Tags messages
// @Security Bearer
// @Security GoogleOAuth
// @Accept json
// @Produce json
// @Param request body LikeRequest true "ID сообщения для лайка"
// @Success 200 {object} map[string]bool "Статус лайка"
// @Failure 400 {object} map[string]string "Некорректный запрос"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 404 {object} map[string]string "Сообщение не найдено"
// @Failure 500 {object} map[string]string "Ошибка сервера"
// @Router /messages/like [put]
func ToggleLikeMessage(c *gin.Context) {
	userID, exists := c.Get("ID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	var req struct {
		MessageID uint `json:"message_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var message models.Message
	if err := db.DB.First(&message, "id = ? AND sender_id = ?", req.MessageID, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
		return
	}

	message.IsLiked = !message.IsLiked

	if err := db.DB.Save(&message).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update like status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"is_liked": message.IsLiked})
}
