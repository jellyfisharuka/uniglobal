package models


type CheckList struct {
	ID      int    `gorm:"column:id"`
	Name    string `gorm:"column:name"`
	TypeID  int    `gorm:"column:type_id"`
	FileURL string `gorm:"column:file_url"`
}

var CheckListTypes = map[int]string{
	1: "Выбор вуза",
	2: "Документы для поступления",
	3: "Переезд и виза",
	4: "Подготовка к интервью",
}