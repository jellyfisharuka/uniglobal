// @title UniGlobal
// @version 1.0
// @description Your AI-powered guide to studying abroad. Get personalized assistance with university selection, documentation, and application process.
// @securityDefinitions.apiKey Bearer
// @in header
// @name Authorization
// @securityDefinitions.oauth2.authorizationCode googleOAuth2
// @tokenUrl https://oauth2.googleapis.com/token
// @authorizationUrl https://accounts.google.com/o/oauth2/auth
// @scope.email Access to your email
// @scope.profile Access to your profile information
// @host localhost:8080
// @BasePath /
package main

import (
	"context"
	"fmt"
	"log"
	"sync"
	_ "uniglobal/docs"
	"uniglobal/internal/app"
	"uniglobal/internal/handlers"
)

// swag init
//swag init -g cmd/main.go
func main() {
	var wg sync.WaitGroup
	ctx := context.Background()
	if err := InitConfig(); err != nil {
		log.Fatalf("Error initializing config: %v", err)
	} else {
		log.Println("OAuth2 config initialized successfully")
	}
	wg.Add(1)
	fmt.Println("test my server")
	go func() {
		defer wg.Done()
	   a, err := app.NewApp(ctx)
   
	   if err != nil {
		   log.Fatalf("Error creating app: %v", err)
	   }
	   if err := a.Run(); err != nil {
		   log.Fatalf("Error running app: %v", err)
	   }
   }()

	wg.Wait()
	
}
	


