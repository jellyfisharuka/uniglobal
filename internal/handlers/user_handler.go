package handlers

import (
	"uniglobal/internal/models"
	"uniglobal/internal/repository"
	"uniglobal/internal/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	Repo *repository.UserRepository
}

type ErrorResponse struct {
    Message string `json:"message"`
}

// @Security Bearer
// @Summary Update user fields
// @Description Update user fields like city, email, phone (optional)
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.UpdateUser true "Fields to update"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /user/updateInfo [put]
func (u UserHandler) UpdateUserFields(c *gin.Context) {
	userID, exists := c.Get("ID")
	if !exists {
		log.Println("Unauthorized access attempt: missing user ID")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
		return
	}

	userIDInt, ok := userID.(int)
	if !ok {
		log.Printf("Invalid user ID format: %v\n", userID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	var updates models.UpdateUser
	if err := c.ShouldBindJSON(&updates); err != nil {
		log.Printf("Failed to parse request body: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	// Вызываем обновление полей пользователя
	if err := u.Repo.UpdateUserFields(uint(userIDInt), updates); err != nil {
		// Проверяем, является ли ошибка одной из кастомных ошибок
		switch err {
		case utils.ErrUsernameExists, utils.ErrInvalidEmail, utils.ErrInvalidPhoneNumber, utils.ErrInvalidCity:
			log.Printf("Validation error for user %d: %v\n", userIDInt, err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			log.Printf("Failed to update user %d: %v\n", userIDInt, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update user"})
		}
		return
	}

	log.Printf("User %d updated successfully\n", userIDInt)
	c.JSON(http.StatusOK, gin.H{"message": "user updated successfully"})
}


// @Security Bearer
// @Summary Changen user password
// @Description Change user password
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.ChangePasswordRequest true "Fields to update"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /user/change_password [put]
func (h *UserHandler) ChangePassword(c *gin.Context) {
	userID, exists := c.Get("ID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
		return
	}

	userIDInt, ok := userID.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	var passwordRequest models.ChangePasswordRequest

	if err := c.ShouldBindJSON(&passwordRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	var user *models.User
	user, err := h.Repo.GetUserByID(uint(userIDInt))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user"})
		return
	}

	if err := utils.CheckPassword(user.Password, passwordRequest.OldPassword, passwordRequest.NewPassword, passwordRequest.ConfirmPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := utils.HashPassword(passwordRequest.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}

	if err := h.Repo.UpdateUserPassword(uint(userIDInt), hashedPassword); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "password updated successfully"})
}

// @Security Bearer
// GetUser godoc
// @Summary Get the authenticated user's info
// @Description Retrieve the information of the currently authenticated user
// @Tags users
// @Accept json
// @Produce json
// @Success 200 {object} models.User
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /user/me [get]
func (h *UserHandler) GetUserInfoByID(c *gin.Context) {
	userID, exists := c.Get("ID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
		return
	}

	userIDInt, ok := userID.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	user, err := h.Repo.GetUserByID(uint(userIDInt))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	response := models.UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Telephone: user.Telephone,
		Gender:    *user.Gender,
		City:      user.City,
		Photo:     *user.Photo,
		Email:     user.Email,
	}
	
	c.JSON(http.StatusOK, response)
}
