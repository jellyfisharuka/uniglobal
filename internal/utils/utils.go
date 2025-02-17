package utils

import (
	"errors"
	"fmt"
	"regexp"

	"golang.org/x/crypto/bcrypt"
)


var (
	ErrUsernameExists       = errors.New("username already exists")
	ErrInvalidEmail         = errors.New("invalid email format")
	ErrInvalidPhoneNumber   = errors.New("invalid phone number format")
	ErrInvalidCity          = errors.New("invalid city selected, must be 'Алматы', 'Астана' or 'Шымкент'")
	ErrRoleNotFound         = errors.New("role not found in database")
	ErrFailedToHashPassword = errors.New("failed to hash password")
	ErrFailedToCreateUser   = errors.New("failed to create user")
	ErrInvalidGender  = errors.New("invalid gender, must be 'Женский' or 'Мужской'")
	ErrIncorrectPassword  = errors.New("incorrect current password")
	ErrPasswordTooShort   = errors.New("password must be at least 8 characters long")
	ErrPasswordsMismatch  = errors.New("new passwords do not match")
	ErrSameAsOldPassword  = errors.New("new password must be different from the old password")
	ErrPasswordEmpty = errors.New("password can not be empty")

	allowedCities = map[string]bool{
		"Алматы": true,
		"Астана": true,
		"Шымкент": true,
	
		
	}

	genderType = map[string]bool {
		"Мужской": true,
		"Женский": true,
	}
)

func IsValidEmail(email string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return re.MatchString(email)
}

func IsValidPhoneNumber(phone string) bool {
	re := regexp.MustCompile(`^\+?[0-9]{10,15}$`)
	return re.MatchString(phone)
}

func IsValidCity(city string) (bool, error){
	if _, ok := allowedCities[city]; !ok {
		return false, fmt.Errorf("invalid city selected")
	}
	return true, nil
}

func IsValidGender(gender string) (bool, error) {
	if _, ok := genderType[gender]; !ok {
		return false, fmt.Errorf("invalid city selected")
	}
	return true, nil
}

func ValidateAndSetGender(gender *string, photo **string) error {
	if gender == nil {
		return nil
	}

	if _, exists := genderType[*gender]; !exists {
		return ErrInvalidGender
	}

	defaultPhoto := "static/avatars/default_man.jpg"
	if *gender == "Женский" {
		defaultPhoto = "static/avatars/default_woman.jpg"
	}
	*photo = &defaultPhoto

	return nil
}

func CheckPassword(hashedOldPassword, oldPassword, newPassword, confirmPassword string) error {  // когда обновляем пароль
	// 1. Проверяем, совпадает ли старый пароль с хэшем в БД
	if err := bcrypt.CompareHashAndPassword([]byte(hashedOldPassword), []byte(oldPassword)); err != nil {
		return ErrIncorrectPassword
	}

	// 2. Проверяем, не слишком ли короткий новый пароль
	if len(newPassword) < 8 {
		return ErrPasswordTooShort
	}

	// 3. Проверяем, не совпадает ли новый пароль со старым
	if oldPassword == newPassword {
		return ErrSameAsOldPassword
	}

	// 4. Проверяем, совпадает ли новый пароль с подтверждением
	if newPassword != confirmPassword {
		return ErrPasswordsMismatch
	}

	return nil
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func CheckLoginPassword(hashedPassword string, plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
	return err == nil
}

func ValidateNewPassword(newPassword, confirmPassword string) error { // при регистрации
	if newPassword == "" {
		return ErrPasswordEmpty
	}

	if len(newPassword) < 8 {
		return ErrPasswordTooShort
	}

	if newPassword != confirmPassword {
		return ErrPasswordsMismatch
	}

	return nil
}
