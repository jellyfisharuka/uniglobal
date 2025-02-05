// @title UniGlobal
// @version 1.0
// @description This is a sample server.
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
	_ "uniglobal/docs"
	"uniglobal/internal/app"
	"context"
	"log"
	"sync"

)

// swag init
//swag init -g cmd/main.go
func main() {
	var wg sync.WaitGroup
	ctx := context.Background()
	wg.Add(1)
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
	


