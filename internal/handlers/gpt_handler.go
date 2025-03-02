package handlers

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"

	//"fmt"
	//"io"

	//"os"

	"github.com/joho/godotenv"
	"github.com/sashabaranov/go-openai"
)

// @Security Bearer
// @Summary GenerateContent
// @Description Generate content based on the given prompt
// @Tags generate
// @Accept  json
// @Produce  json
// @Param question body models.Question true "Question to get answer for"
// @Success 200 {object} map[string]string
// @Router /api/generate/gpt [post]
func GeneratePythonHandler(ctx context.Context, prompt string) (string, error) {
	answer, err := generateChatgpt(ctx, prompt)
	if err != nil {
		return "", err
	}
	return answer, nil
}

func generateChatgpt(ctx context.Context, question string) (string, error) {
	envPath := filepath.Join("..", "pkg", ".env") 
	err := godotenv.Load(envPath)
    if err != nil {
        log.Fatal("Ошибка при загрузке .env файла")
    }
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		log.Fatal("OPENAI_API_KEY не установлен")
	}
	fmt.Println(apiKey)
	client := openai.NewClient(apiKey)

	request := openai.ChatCompletionRequest{
		Model: "gpt-4o-mini", 
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    "user", 
				Content: question,
			},
		},
		Temperature: 0.7, 
	}

	// Выполняем запрос
	response, err := client.CreateChatCompletion(ctx, request)
	if err != nil {
		log.Printf("Error while calling OpenAI: %v", err)
		return "", err
	}

	// Возвращаем текст ответа
	return response.Choices[0].Message.Content, nil
}

