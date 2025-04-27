package handlers

import (
	"uniglobal/internal/auth"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
    "uniglobal/internal/gooogle"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/sessions"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
	"google.golang.org/api/option"
)
var Oauth2Config *oauth2.Config

func InitConfig() {
	Oauth2Config = &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URI"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
			gmail.GmailReadonlyScope,
		},
		Endpoint: google.Endpoint,
	}
}

func HandleOAuth2Callback(code string, c *gin.Context) (*oauth2.Token, error) {
	if Oauth2Config== nil {
        return nil, fmt.Errorf("oauth2Config is not initialized in handleOath")
    }
	tok, err := Oauth2Config.Exchange(context.Background(), code)
	if err != nil {
		log.Printf("Failed to exchange token: %v", err)
		log.Fatalf("Unable to retrieve token from web: %v", err)
		return nil, err
	}
	accessToken := tok.AccessToken
	fmt.Println(accessToken)
	userEmail, err:= gooogle.GetUserInfo(accessToken)
	if err!=nil {
		fmt.Println("error getting user info:", err)
		return nil, err
	}
	
	fmt.Println("Email sent successfully to: ", userEmail) 
	session:= sessions.Default(c)
	session.Set("access_token", tok.AccessToken)
	session.Set("refresh_token", tok.RefreshToken)
	session.Set("expiry", tok.Expiry)
	session.Save()
	
	return tok, nil
}

func LoginGoogleHandler(config *oauth2.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		if config == nil {
            c.String(http.StatusInternalServerError, "OAuth2 config is not initialized.")
            return
        }
		authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
		c.Redirect(http.StatusFound, authURL)
	}
}
func fetchGmailLabels(ctx context.Context, config *oauth2.Config) {
	client := auth.GetClient(config)
	srv, err := gmail.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		log.Fatalf("Unable to retrieve Gmail client: %v", err)
	}

	user := "me"
	r, err := srv.Users.Labels.List(user).Do()
	if err != nil {
		log.Fatalf("Unable to retrieve labels: %v", err)
	}
	if len(r.Labels) == 0 {
		fmt.Println("No labels found.")
		return
	}
	fmt.Println("Labels:")
	for _, l := range r.Labels {
		fmt.Printf("- %s\n", l.Name)
	}
}
