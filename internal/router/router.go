package router

import (
	"net/http"
	"net/http/pprof"
	"uniglobal/internal/auth"
	"uniglobal/internal/handlers"
	"uniglobal/internal/repository"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/tmc/langchaingo/llms/googleai"
)

var (
    llm    *googleai.GoogleAI
)

func SetupRouter(r *gin.Engine)  {
    repos := repository.NewRepositories() 

    rHandlers := handlers.NewHandlers(repos) // resource handlers 
    letterHandler := handlers.LetterHandler{} 
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    pprofGroup := r.Group("/debug/pprof")
    {
        pprofGroup.GET("/", gin.WrapH(http.HandlerFunc(pprof.Index)))
        pprofGroup.GET("/cmdline", gin.WrapH(http.HandlerFunc(pprof.Cmdline)))
        pprofGroup.GET("/profile", gin.WrapH(http.HandlerFunc(pprof.Profile)))
        pprofGroup.GET("/symbol", gin.WrapH(http.HandlerFunc(pprof.Symbol)))
        pprofGroup.GET("/trace", gin.WrapH(http.HandlerFunc(pprof.Trace)))
        pprofGroup.GET("/heap", gin.WrapH(http.HandlerFunc(pprof.Handler("heap").ServeHTTP)))
        pprofGroup.GET("/goroutine", gin.WrapH(http.HandlerFunc(pprof.Handler("goroutine").ServeHTTP)))
        pprofGroup.GET("/threadcreate", gin.WrapH(http.HandlerFunc(pprof.Handler("threadcreate").ServeHTTP)))
        pprofGroup.GET("/block", gin.WrapH(http.HandlerFunc(pprof.Handler("block").ServeHTTP)))
        pprofGroup.GET("/mutex", gin.WrapH(http.HandlerFunc(pprof.Handler("mutex").ServeHTTP)))
    }

    r.POST("/login", handlers.LoginHandler)
	r.POST("/signup", handlers.SignupHandler)
	r.GET("/oauth2callback", handlers.OAuth2CallbackHandler)
	r.GET("/googleLogin", handlers.LoginGoogleHandler(handlers.Oauth2Config))

    r.PUT("/user/updateInfo",  auth.AuthMiddleware(), rHandlers.UserHandler.UpdateUserFields)
	r.PUT("/user/change_password", auth.AuthMiddleware(), rHandlers.UserHandler.ChangePassword)
	r.GET("/user/me", auth.AuthMiddleware(),rHandlers.UserHandler.GetUserInfoByID)

    r.POST("/chats", auth.AuthMiddleware(), rHandlers.ChatHandler.CreateChat)
    r.GET("/chats/:id", auth.AuthMiddleware(), rHandlers.ChatHandler.GetChat)
    r.POST("/chats/:chatID/messages", auth.AuthMiddleware(), func(c *gin.Context) {
		rHandlers.ChatHandler.SendMessage(c) 
	})
	r.GET("/chats", auth.AdminMiddleware(), rHandlers.ChatHandler.GetAllChats)
	r.GET("/userchats", auth.AuthMiddleware(), rHandlers.ChatHandler.GetUserChats)
    
    r.POST("/api/generate/letter", auth.AuthMiddleware(), func(c *gin.Context) {
		handlers.GenerateLetterHandler(c, llm)
	})

	// Add endpoints to get letter by ID and get all user's letters
	r.GET("/api/letters/:id", auth.AuthMiddleware(), letterHandler.GetLetterByID)
	r.GET("/api/letters", auth.AuthMiddleware(), letterHandler.GetUserLetters)

    r.POST("/send_checklist", auth.AuthMiddleware(), rHandlers.ChecklistHandler.SendCheckListByType)
    r.POST("/send_default_checklist", rHandlers.ChecklistHandler.SendDefaultCheckList)

    r.GET("/favorites", auth.AuthMiddleware(), handlers.GetFavResponses)
    r.PUT("/messages/like", auth.AuthMiddleware(), handlers.ToggleLikeMessage)
    
}
