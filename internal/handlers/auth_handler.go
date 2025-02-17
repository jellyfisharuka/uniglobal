package handlers

import (
	"uniglobal/internal/auth"
	"uniglobal/internal/db"
	"uniglobal/internal/models"
	"uniglobal/internal/utils"
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
)

// @Summary Login user
// @Description Logs in an existing user
// @Tags Auth
// @Accept  json
// @Produce  json
// @Param   user  body      models.LoginSwagger  true  "New user information"  Example: {"username": "exampleUser", "password": "examplePassword"}
// @Success 200    {object}  map[string]string
// @Failure 400    {object}  map[string]string
// @Failure 401    {object}  map[string]string
// @Router  /login [post]
func LoginHandler(c *gin.Context) {
	var loginUser models.User
	if err := c.BindJSON(&loginUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	var existingUser models.User
	result := db.DB.Select("ID", "username", "password").Where("username = ?", loginUser.Username).First(&existingUser)
	if result.Error != nil || !utils.CheckLoginPassword(existingUser.Password, loginUser.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	token, err := auth.GenerateToken(existingUser.Username, int(existingUser.ID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}
	fmt.Println("Generated token:", token)
	//err = db.RedisClient.Set(db.Ctx, fmt.Sprintf("token:%s", existingUser.Username), token, 0).Err()
	//if err != nil {
	//	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store token"})
	//	return
	//}
	c.SetCookie("auth_token", token, 3600, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"token": token})

}

// @Summary Sign up user
// @Description Signs up a new user
// @Tags Auth
// @Accept  json
// @Produce  json
// @Param   user  body      models.SignupSwagger  true  "New user information"  Example: {"username": "exampleUser", "password": "examplePassword", "firstName": "John", "lastName": "Doe"}
// @Success 201    {object}  map[string]string
// @Failure 400    {object}  map[string]string
// @Failure 500    {object}  map[string]string
// @Router  /signup [post]
func SignupHandler(c *gin.Context) {
	var signupJson models.SignupSwagger
	if err := c.BindJSON(&signupJson); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Валидация структуры signupJson
	validate := validator.New()
	if err := validate.Struct(signupJson); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed"})
		return
	}

	// Проверка пароля и confirm password
	if err := utils.ValidateNewPassword(signupJson.Password, signupJson.ConfirmPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Создание объекта User
	newUser := models.User{
		Username:  signupJson.Username,
		Password:  signupJson.Password,
		FirstName: signupJson.FirstName,
		LastName:  signupJson.LastName,
		Email:     signupJson.Email,
		Telephone: signupJson.Telephone,
		City:      signupJson.City,
		Gender:    &signupJson.Gender,
	}

	// Регистрация пользователя
	err := auth.SignupUser(db.DB, newUser)
	switch err {
	case nil:
		c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
	case utils.ErrUsernameExists:
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
	case utils.ErrInvalidEmail, utils.ErrInvalidPhoneNumber, utils.ErrInvalidCity, utils.ErrInvalidGender:
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	case utils.ErrRoleNotFound:
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrFailedToCreateUser.Error()})
	}
}



