package handlers

import (
	"uniglobal/internal/db"
	"uniglobal/internal/models"
	"fmt"
	"net/http"

	//"net/http"
	//"net/http"

	"github.com/gin-gonic/gin"
	//"github.com/tmc/langchaingo/llms/googleai"
)

// @Security Bearer
// @Security GoogleOAuth
// @Summary Create Motivational Letter
// @Description Generate a motivational letter based on user data
// @Tags letters
// @Accept  application/x-www-form-urlencoded
// @Produce  json
// Param name formData string true "Name"
// @Param age formData int true "Age"
// @Param university formData string true "University"
// @Param country formData string true "Country"
// @Success 200 {object} map[string]string
// @Router /api/generate/motivational_letter [post]
func CreateMotivationalLetterHandler(c *gin.Context) {
	//name := c.PostForm("name")
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
	name := user.FirstName
	email := user.Email
	phone := user.Telephone
	age := c.PostForm("age")
	university := c.PostForm("university")
	country := c.PostForm("country")

	prompt := fmt.Sprintf("My name is %s, I am %s years old, my email is %s, my telephone number is %s. I want to apply to %s. I am from %s. Please generate a complete motivational letter for university admission without any placeholders or example instructions. Include only the final content of the letter.", name, age, email, phone, university, country)
    fmt.Println("Prompt:", prompt)
	answer, err := GeneratePythonHandler(c.Request.Context(), prompt)
	fmt.Println("answer", answer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate letter", "details": err.Error()})
		return
	}

	// Отправляем JSON-ответ с результатом
	c.JSON(http.StatusOK, gin.H{"motivational_letter": answer})
}