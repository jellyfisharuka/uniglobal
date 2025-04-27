package repository

import (
	"uniglobal/internal/models"
	"uniglobal/internal/utils"
	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func (u *UserRepository) UpdateUserFields(userID uint, updates models.UpdateUser) error {
	if updates.Username != nil {
		var existingUser models.User
		if err := u.DB.Where("username = ?", *updates.Username).First(&existingUser).Error; err == nil {
			return utils.ErrUsernameExists
		}
	}

	if updates.Email != nil && !utils.IsValidEmail(*updates.Email) {
		return utils.ErrInvalidEmail
	}

	if updates.Telephone != nil && !utils.IsValidPhoneNumber(*updates.Telephone) {
		return utils.ErrInvalidPhoneNumber
	}

	//if updates.Gender != nil {
	//	if _, err := utils.IsValidGender(*updates.Gender); err != nil {
	//		return utils.ErrInvalidGender
	//	}
	//}

	return u.DB.Model(&models.User{}).Where("id = ?", userID).Updates(updates).Error
}

func (u *UserRepository) UpdateUserPassword(userID uint, hashedPassword string) error {
	return u.DB.Model(&models.User{}).
		Where("id = ?", userID).
		Update("password", hashedPassword).
		Error
}

func (r *UserRepository) GetUserByID(userID uint) (*models.User, error) {
	var user models.User
	if err := r.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}






