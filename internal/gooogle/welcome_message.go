package gooogle

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type EmailService struct {
	APIKey string
	From   *mail.Email
}

func NewEmailService() (*EmailService, error) {
	envPath := filepath.Join("..", "pkg", ".env")
	err := godotenv.Load(envPath)
	if err != nil {
		log.Println("⚠️ Не удалось загрузить .env, используем переменные окружения")
	}

	apiKey := os.Getenv("SENDGRID_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("SENDGRID_API_KEY не установлен")
	}
    fmt.Println("apikey", apiKey)
	fromEmail := os.Getenv("SENDGRID_FROM_EMAIL")
	if fromEmail == "" {
		fromEmail = "arukeulen@gmail.com" // Дефолтный email
	}

	return &EmailService{
		APIKey: apiKey,
		From:   mail.NewEmail("UniGlobal", fromEmail),
	}, nil
}

func (s *EmailService) SendEmail(toEmail, subject, textContent, htmlContent string) error {
	to := mail.NewEmail("", toEmail)

	message := mail.NewSingleEmail(s.From, subject, to, textContent, htmlContent)
	client := sendgrid.NewSendClient(s.APIKey)
	response, err := client.Send(message)
   fmt.Println("response", response)
	if err != nil {
		log.Printf("❌ Ошибка отправки письма: %v", err)
		return err
	}
	log.Printf("✅ Email отправлен! Status: %d", response.StatusCode)
	return nil
}