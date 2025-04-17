package models

import (
	"time"

)

type User struct {
	ID              int    `gorm:"uniqueIndex;not null"`
	Username        string `gorm:"uniqueIndex;not null"`
	Password        string `gorm:"not null"`
	ConfirmPassword string `json:"confirm_password"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
	FirstName       string
	LastName        string
	Telephone       string
	Gender          *string
	City            string
	Photo           *string
	Email           string
	//RoleID          int
	//Role            Role
	Chats           []Chat
}
type SignupSwagger struct {
	Username  string `json:"username"`            // Уникальное имя пользователя
	Password  string `json:"password"`            // Пароль пользователя
	FirstName string `json:"firstName"`           // Имя пользователя
	LastName  string `json:"lastName"`            // Фамилия пользователя
	Telephone string `json:"telephone,omitempty"` // Номер телефона пользователя
	Email     string `json:"email"`
	//RoleID    int    `json:"roleID,omitempty"` // ID роли пользователя
	ConfirmPassword string `json:"confirm_password"`
	City            string
	Gender          string
}
type LoginSwagger struct {
	Username string `json:"username"` // Уникальное имя пользователя
	Password string `json:"password"` // Пароль пользователя
}

type UserInfo struct {
	ID    string `json:"sub"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

type UpdateUser struct {
	City      *string
	Email     *string
	Telephone *string
	Username  *string
	Gender    *string
	Photo     *string
}

type ChangePasswordRequest struct {
	OldPassword     string `json:"old_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=6"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

type UserResponse struct {
	ID        int    `json:"id"`
	Username  string `json:"username"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Telephone string `json:"telephone"`
	Gender    string `json:"gender"`
	City      string `json:"city"`
	Photo     string `json:"photo"`
	Email     string `json:"email"`
}

