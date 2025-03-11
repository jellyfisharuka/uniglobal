package handlers

import (
	"fmt"
	"net/http"
	"time"
	"uniglobal/internal/db"
	"uniglobal/internal/models"

	"github.com/gin-gonic/gin"
	//	"github.com/tmc/langchaingo/llms/googleai"
)

// @Security Bearer
// @Summary Create Recommendation Letter
// @Description Generate a basic recommendation letter based on provided user data
// @Tags letters
// @Accept application/x-www-form-urlencoded
// @Produce json
// @Param relationship formData string true "Relationship with Candidate"
// @Param achievements formData string true "Key Achievements of Candidate"
// @Param qualities formData string true "Key Qualities of Candidate"
// @Success 200 {object} map[string]string
// @Router /api/generate/recommendation_letter [post]
func CreateRecommendationLetterHandler(c *gin.Context) {
	
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
	relationship := c.PostForm("relationship")
	achievements := c.PostForm("achievements")
	qualities := c.PostForm("qualities")
	//authorName := c.PostForm("author_name")
    currentDate := time.Now().Format("January 2, 2006")
	prompt := fmt.Sprintf("I am writing to recommend %s. As their %s, I have seen firsthand their dedication and achievements, such as %s. %s demonstrates qualities like %s, which make them an excellent candidate. Include only the final content of the letter and add today's date: %s. Please write without placeholder brackets and not include placeholder bracket for author name", name, relationship, achievements, name, qualities, currentDate)
   // if authorName != "" {
	//	prompt += fmt.Sprintf(" Sincerely, %s. and today's date: %s.", authorName, currentDate)
	//}
	fmt.Println("prompt", prompt)
	 answer, err := GeneratePythonHandler(c.Request.Context(), prompt)
	 if err != nil {
		 c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate letter", "details": err.Error()})
		 return
	 }
     fmt.Println("answer", answer)
	 c.JSON(http.StatusOK, gin.H{"recommendation_letter": answer})
}
