package handlers

import "uniglobal/internal/repository"

type Handlers struct {
	UserHandler      *UserHandler
	ChatHandler      *ChatHandler
	ChecklistHandler *CheckListHandler
}

func NewHandlers(repos *repository.Repositories) *Handlers {
	return &Handlers{
		UserHandler:      &UserHandler{Repo: repos.UserRepo},
		ChatHandler:      &ChatHandler{Repo: repos.ChatRepo},
		ChecklistHandler: &CheckListHandler{Repo: repos.ChecklistRepo},
	}
}