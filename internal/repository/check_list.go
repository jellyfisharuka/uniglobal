package repository

import (
	"errors"
	"uniglobal/internal/models"

	"gorm.io/gorm"
)

type CheckListRepository struct {
	DB *gorm.DB
}

func NewCheckListRepository(db *gorm.DB) *CheckListRepository {
	return &CheckListRepository{DB: db}
}

func (r *CheckListRepository) GetFileByTypeID(typeID int) (string, error) {
	var checklist models.CheckList

	err := r.DB.Where("type_id = ?", typeID).First(&checklist).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", nil
		}
		return "", err
	}

	return checklist.FileURL, nil
}

