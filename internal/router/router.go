package router

import (
	"net/http"
	"net/http/pprof"
	"uniglobal/internal/auth"
	"uniglobal/internal/db"
	"uniglobal/internal/handlers"
	"uniglobal/internal/repository"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRouter(r *gin.Engine)  {
    userRepo:= &repository.UserRepository{DB: db.DB}
    userHandler := &handlers.UserHandler{Repo:userRepo}
    chatRepo := &repository.ChatRepository{DB: db.DB}
    chatHandler := &handlers.ChatHandler{Repo: chatRepo}
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
    r.PUT("/user/updateInfo",  auth.AuthMiddleware(), userHandler.UpdateUserFields)
	r.PUT("/user/change_password", auth.AuthMiddleware(), userHandler.ChangePassword)
	r.GET("/user/me", auth.AuthMiddleware(), userHandler.GetUserInfoByID)
    r.POST("/chats", auth.AuthMiddleware(), chatHandler.CreateChat)
    r.GET("/chats/:id", auth.AuthMiddleware(), chatHandler.GetChat)
    r.POST("/chats/:chatID/messages", auth.AuthMiddleware(), func(c *gin.Context) {
		chatHandler.SendMessage(c) 
	})
	r.GET("/chats", auth.AdminMiddleware(), chatHandler.GetAllChats)
	r.GET("/userchats", auth.AuthMiddleware(), chatHandler.GetUserChats)
    r.POST("/api/generate/motivational_letter", auth.AuthMiddleware(), func(c *gin.Context) {
		handlers.CreateMotivationalLetterHandler(c)})
		r.POST("/api/generate/recommendation_letter", auth.AuthMiddleware(), func(c *gin.Context) {
			handlers.CreateRecommendationLetterHandler(c)})
}
