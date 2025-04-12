package models


type CheckList struct {
	ID      int    `gorm:"column:id"`
	Name    string `gorm:"column:name"`
	TypeID  int    `gorm:"column:type_id"`
	FileURL string `gorm:"column:file_url"`
}

var CheckListTypes = map[int]string{
	1: "Общий чек-лист поступления за границу",  
	2: "Чек-лист выбора университета и программы для поступления за границу",
	3: "Чек-лист подготовки документов",
	4: "Чек-лист подготовки к IELTS/TOEFL",
	5:"Чек-лист подготовки к пеерезду на учебу за границу",
}