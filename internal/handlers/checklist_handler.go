package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"uniglobal/internal/db"
	"uniglobal/internal/gooogle"
	"uniglobal/internal/models"
	"uniglobal/internal/repository"

	"github.com/gin-gonic/gin"
)

const (
	subject = "Ваш чек-лист готов!"
)

type CheckListHandler struct {
	Repo *repository.CheckListRepository
}

// @Security Bearer
// @Security GoogleOAuth
// GetCheckList получает файл по ID типа чек-листа и отправляет в email пользователя
// @Summary Получить чек-лист
// @Description Возвращает URL файла для указанного типа чек-листа и отправляет на почту пользователя
// @Tags checklist
// @Produce json
// @Param type_id query int true "ID типа чек-листа"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /send_checklist [post]
func (h *CheckListHandler) SendCheckListByType(c *gin.Context) {
	userID, exists := c.Get("ID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}
	var user models.User
	
	if err := db.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	email := user.Email
	typeIDStr := c.Query("type_id")

	typeID, err := strconv.Atoi(typeIDStr)
	if err != nil || typeID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid 'type_id' parameter"})
		return
	}
	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'email' parameter"})
		return
	}

	if _, exists := models.CheckListTypes[typeID]; !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unknown checklist type"})
		return
	}

	fileURL, err := h.Repo.GetFileByTypeID(typeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve checklist"})
		return
	}
	if fileURL == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Checklist not found"})
		return
	}

	emailService, err := gooogle.NewEmailService()
	if err != nil {
		log.Println("Ошибка инициализации email сервиса:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Email service unavailable"})
		return
	}

	textContent := fmt.Sprintf("Здравствуйте!\n\nВаш чек-лист готов: %s\n\nС уважением, команда UniGlobal", fileURL)
	htmlContent := fmt.Sprintf("<p>Здравствуйте!</p><p>Ваш чек-лист готов: <a href='%s'>Скачать</a></p><p>С уважением, команда UniGlobal</p>", fileURL)

	go func() {
		if err := emailService.SendEmail(email, subject, textContent, htmlContent); err != nil {
			log.Println("Ошибка отправки письма:", err)
			fmt.Println("email", email)
		} else {
			log.Println("Письмо с чек-листом успешно отправлено!")
		}
	}()

	c.JSON(http.StatusOK, gin.H{"message": "Check-list has been sent to your email"})
}

// SendDefaultCheckList отправляет чек-лист незарегистрированному пользователю
// @Summary Получить чек-лист (для незарегистрированного пользователя)
// @Description Возвращает URL файла чек-листа и отправляет его на указанную почту
// @Tags checklist
// @Produce json
// @Param email query string true "Email незарегистрированного пользователя"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /send_default_checklist [post]
func (h *CheckListHandler) SendDefaultCheckList(c *gin.Context) {
	email := c.Query("email")

	if email == "" {
		log.Println("Ошибка: отсутствует параметр 'email'")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'email' parameter"})
		return
	}

	fileURL, err := h.Repo.GetFileByTypeID(100)
	if err != nil {
		log.Println("Ошибка при получении чек-листа:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve checklist"})
		return
	}

	if fileURL == "" {
		log.Println("Ошибка: чек-лист не найден")
		c.JSON(http.StatusNotFound, gin.H{"error": "Checklist not found"})
		return
	}

	emailService, err := gooogle.NewEmailService()
	if err != nil {
		log.Println("Ошибка инициализации email-сервиса:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Email service unavailable"})
		return
	}

	subject := "Ваш чек-лист от UniGlobal"
	textContent := fmt.Sprintf("Здравствуйте!\n\nВаш чек-лист готов: %s\n\nС уважением, команда UniGlobal", fileURL)
	htmlContent := fmt.Sprintf(`
		<p>Здравствуйте!</p>
		<p>Ваш чек-лист готов: <a href='%s'>Скачать</a></p>
		<p>С уважением, команда UniGlobal</p>`, fileURL)

	go func() {
		if err := emailService.SendEmail(email, subject, textContent, htmlContent); err != nil {
			log.Println("Ошибка отправки письма:", err)
		} else {
			log.Println("Письмо с чек-листом успешно отправлено на", email)
		}
	}()

	c.JSON(http.StatusOK, gin.H{"message": "Check-list has been sent to your email"})
}