package models

import "gorm.io/gorm"

type FAQ struct {
	gorm.Model
	Question string
	Answer   string
}