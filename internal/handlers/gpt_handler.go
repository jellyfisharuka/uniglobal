package handlers

import (
	"uniglobal/internal/models"
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"

	//"fmt"
	//"io"
	"net/http"

	//"os"

	"github.com/gin-gonic/gin"
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
func GeneratePythonHandler(c *gin.Context) (string, error){
	var question models.Question
	if err := c.ShouldBindJSON(&question); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request", "details": err.Error()})
		return "", err
	}
	ctx := c.Request.Context()
	answer, err := generateChatgpt(ctx, question.Question)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate answer"})
		return "", err
	}

	c.JSON(http.StatusOK, models.AnswerResponse{Answer: answer})
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

