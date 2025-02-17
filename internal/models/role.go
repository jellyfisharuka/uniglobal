package models

type Role struct {
	ID   int    `gorm:"primaryKey"`
	Name string `gorm:"unique;not null"` //"admin", "user"

}