package handlers

import (
	"fmt"
	"log"
	"net/http"
	"uniglobal/internal/auth"
	"uniglobal/internal/db"
	"uniglobal/internal/gooogle"
	"uniglobal/internal/models"
	"uniglobal/internal/utils"

	"github.com/gin-gonic/gin"
)

func OAuth2CallbackHandler(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Auth code not found"})
		return
	}

	tok, err := HandleOAuth2Callback(code, c)
	if err != nil {
		log.Printf("OAuth callback error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve token from web"})
		return
	}

	googleUser, err := gooogle.GetUserInfo(tok.AccessToken)
	if err != nil {
		log.Printf("Error getting Google user info: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info"})
		return
	}

	newUser := models.User{
		Username:  googleUser.Username,
		Email:     googleUser.Email,
		FirstName: googleUser.GivenName,
		LastName:  googleUser.FamilyName,
	}

	err = auth.SignupGoogleUser(db.DB, newUser)
	if err != nil && err != utils.ErrUsernameExists {
		log.Printf("Error creating user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	var user models.User
	if result := db.DB.Where("email = ?", googleUser.Email).First(&user); result.Error != nil {
		log.Printf("Error retrieving user: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}

	jwtToken, err := auth.GenerateToken(googleUser.Username, int(user.ID))
	if err != nil {
		log.Printf("Error generating token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	// Set cookie and respond
	c.SetCookie("uni_auth_token", jwtToken, 3600*72, "/", c.Request.Host, false, false)
	fmt.Println("redirect moment")
	c.Redirect(http.StatusFound, "https://uniglobal-front.onrender.com/dashboard/profile")
}
