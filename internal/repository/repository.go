package repository

import "uniglobal/internal/db"

type Repositories struct {
    UserRepo      *UserRepository
    ChatRepo      *ChatRepository
    ChecklistRepo *CheckListRepository
}

func NewRepositories() *Repositories {
    db := db.DB

    return &Repositories{
        UserRepo:      &UserRepository{DB: db},
        ChatRepo:      &ChatRepository{DB: db},
        ChecklistRepo: &CheckListRepository{DB: db},
    }
}