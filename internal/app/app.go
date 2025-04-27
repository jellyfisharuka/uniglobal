package app

import (
	"context"
	"log"
	"net/http"
	_ "net/http/pprof"
	"os"
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
	//gmailPath:= filepath.Join("..", "internal", "config", "gmail.json")
	//gmailPath := filepath.Join("..", "pkg", "gmail.json")
	//envPath := filepath.Join("..", "pkg", ".env")
	workDir, err := os.Getwd()
	if err != nil {
		return err
	}
    
	//jsonPath := filepath.Join(workDir, "internal", "config", "config.json")
	gmailPath := filepath.Join(workDir,  "internal", "config", "gmail.json")
	envPath := filepath.Join(workDir, "pkg", ".env")
	err = config.LoadEnvConfig(envPath)
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
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // локально будет 8080
	}
	address := "0.0.0.0:" + port
	//address := "0.0.0.0:8080"
	log.Printf("HTTP server is running on %s", address)
	go func() {
		log.Println("Starting pprof server on :6060")
		log.Println(http.ListenAndServe("0.0.0.0:6060", nil))
	}()
	err := a.router.Run(address)
	if err != nil {
		return err
	}
	return nil
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		allowedOrigins := map[string]bool{
			"https://uniglobal-front.onrender.com": true,
			"http://localhost:3000": true, // для локальной разработки
		}
        
		origin := c.Request.Header.Get("Origin")
        
		method := c.Request.Method
        path := c.Request.URL.Path

        log.Printf("[CORS] %s request to %s from origin: %s", method, path, origin)

		c.Writer.Header().Set("Vary", "Origin") // всегда должен быть

		if allowedOrigins[origin] {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")
		}

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func (a *App) initRouter(_ context.Context) error {
    a.router = gin.Default()  // СНАЧАЛА создаём роутер

    a.router.Use(CORSMiddleware()) // потом уже вешаем мидлварки
    store := cookie.NewStore([]byte("secret"))
    a.router.Use(sessions.Sessions("mysession", store))

    router.SetupRouter(a.router)

    return nil
}