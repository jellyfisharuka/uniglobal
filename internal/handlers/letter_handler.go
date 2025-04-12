package handlers

import (
	"uniglobal/internal/db"
	"uniglobal/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tmc/langchaingo/llms/googleai"
)

type LetterHandler struct{}

type LetterRequest struct {
	LetterType   string `json:"letterType" binding:"required"`
	Program      string `json:"program" binding:"required"`
	Subjects     string `json:"subjects"`
	Achievements string `json:"achievements"`
	Skills       string `json:"skills"`
	Goals        string `json:"goals"`
}

// @Security Bearer
// @Summary Generate Letter
// @Description Generate a motivational or recommendation letter based on user data
// @Tags letters
// @Accept json
// @Produce json
// @Param request body LetterRequest true "Letter generation request"
// @Success 200 {object} map[string]interface{}
// @Router /api/generate/letter [post]
func GenerateLetterHandler(c *gin.Context, llm *googleai.GoogleAI) {
	var request LetterRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user info from auth middleware
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

	// Create appropriate prompt based on letter type
	var prompt string
	if request.LetterType == "motivational" {
		prompt = createMotivationalLetterPrompt(user, request)
	} else if request.LetterType == "recommendation" {
		prompt = createRecommendationLetterPrompt(user, request)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid letter type"})
		return
	}

	// Generate letter
	c.Set("prompt", prompt)
	userIDStr := fmt.Sprintf("%d", userID)
	generatedContent, err := GeneratePythonHandler(c.Request.Context(), userIDStr, prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate letter"})
		return
	}

	// Save letter to database
	letter := models.Letter{
		UserID:       uint(userID.(int)),
		LetterType:   request.LetterType,
		Program:      request.Program,
		Subjects:     request.Subjects,
		Achievements: request.Achievements,
		Skills:       request.Skills,
		Goals:        request.Goals,
		Content:      generatedContent,
	}

	if err := db.DB.Create(&letter).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save letter"})
		return
	}

	// Return generated letter and ID
	c.JSON(http.StatusOK, gin.H{
		"id":      letter.ID.String(),
		"content": generatedContent,
		"type":    request.LetterType,
		"program": request.Program,
	})
}

func createMotivationalLetterPrompt(user models.User, request LetterRequest) string {
	return fmt.Sprintf(`Generate a complete motivational letter for university admission written BY THE STUDENT with the following information:
Name: %s %s
Email: %s
Phone: %s
City: %s
Program: %s
Subjects of interest: %s
Achievements: %s
Skills: %s
Future goals: %s

Format the letter with proper headers including the student's name, contact information, and date at the top, followed by university information and salutation.

The letter should be formal and professional, written from the student's first-person perspective, highlighting why the student is a good fit for the program.

Format without placeholder brackets - use the actual information provided. Include all standard letter components (header with student info, date, recipient info, salutation, body, closing).

Write the complete final version of the letter without placeholders or instructions. The letter should be in English.`,
		user.FirstName, user.LastName,
		user.Email,
		user.Telephone,
		user.City,
		request.Program,
		request.Subjects,
		request.Achievements,
		request.Skills,
		request.Goals)
}

func createRecommendationLetterPrompt(user models.User, request LetterRequest) string {
	return fmt.Sprintf(`Generate a complete self-recommendation letter for a university application written BY THE STUDENT with the following information:
Student name: %s %s
Email: %s
Phone: %s
City: %s
Program applied for: %s
Academic subjects: %s
Key achievements: %s
Notable skills: %s
Career goals: %s

Format the letter with proper headers including the student's name, contact information, and date at the top, followed by university information and salutation.

The letter should be formal and professional, written from the student's first-person perspective, where the student recommends themselves for the program.

Format without placeholder brackets - use the actual information provided. Include all standard letter components (header with student info, date, recipient info, salutation, body, closing).

Write the complete final version of the letter without placeholders or instructions. The letter should be in English.`,
		user.FirstName, user.LastName,
		user.Email,
		user.Telephone,
		user.City,
		request.Program,
		request.Subjects,
		request.Achievements,
		request.Skills,
		request.Goals)
}

// @Security Bearer
// @Summary Get letter by ID
// @Description Retrieve a letter by its ID
// @Tags letters
// @Accept json
// @Produce json
// @Param id path string true "Letter ID"
// @Success 200 {object} models.Letter
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /api/letters/{id} [get]
func (h *LetterHandler) GetLetterByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	userID, exists := c.Get("ID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var letter models.Letter
	if err := db.DB.First(&letter, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Letter not found"})
		return
	}

	// Verify the user owns this letter
	if letter.UserID != uint(userID.(int)) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to access this letter"})
		return
	}

	c.JSON(http.StatusOK, letter)
}

// @Security Bearer
// @Summary Get user's letters
// @Description Retrieve all letters for the current user
// @Tags letters
// @Accept json
// @Produce json
// @Success 200 {array} models.Letter
// @Failure 400 {object} ErrorResponse
// @Router /api/letters [get]
func (h *LetterHandler) GetUserLetters(c *gin.Context) {
	userID, exists := c.Get("ID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var letters []models.Letter
	if err := db.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&letters).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve letters"})
		return
	}

	c.JSON(http.StatusOK, letters)
}

