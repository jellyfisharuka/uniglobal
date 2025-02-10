package app

import (
	"context"
	"log"
	"net/http"
	_ "net/http/pprof"
	"path/filepath"
	"uniglobal/internal/config"
	"uniglobal/internal/db"
	"uniglobal/internal/router"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

type App struct {
	router *gin.Engine
}
func NewApp(ctx context.Context) (*App, error) {
	a := &App{}

	err := a.initDeps(ctx)
	if err != nil {
		return nil, err
	}

	return a, nil
}
func (a *App) initConfig(_ context.Context) error {
	gmailPath:= filepath.Join("..", "internal", "config", "gmail.json")
	envPath := filepath.Join("..", "pkg", ".env")
	err := config.LoadEnvConfig(envPath)
    if err != nil {
        return err
    }
	err = config.LoadGmailConfig(gmailPath)
	if err != nil {
        return err
    }
	db.ConnectDB()
	//db.InitRedis()

	return nil

}
func (a *App) initDeps(ctx context.Context) error {
	inits := []func(context.Context) error{
		a.initConfig,
		func(ctx context.Context) error { 
			return a.initRouter(ctx)
		},
	}

	for _, f := range inits {
		err := f(ctx)
		if err != nil {
			return err
		}
	}

	return nil
}
func (a *App) Run() error {
	//address := "0.0.0.0:8080"
	address := "localhost:8080"
	log.Printf("HTTP server is running on %s", address)
	go func() {
        log.Println("Starting pprof server on :6060")
        log.Println(http.ListenAndServe("localhost:6060", nil)) // Порт для pprof
    }()
	//err := http.ListenAndServe(address, a.router)
	err:= a.router.Run(address)
	if err != nil {
		return err
	}
	return nil
}
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
		}
		c.Next()
	}
}
func (a *App) initRouter(_ context.Context) error {
	store := cookie.NewStore([]byte("secret"))
	a.router = gin.Default()
	a.router.Use(sessions.Sessions("mysession", store))
	a.router.Use(CORSMiddleware())
	router.SetupRouter(a.router)
	return nil
}