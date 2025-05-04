package handlers

import (
	"context"
	"errors"
	"log"
	"sync"
	"uniglobal/internal/config"

	"github.com/sashabaranov/go-openai"
)

var chatHistories = make(map[string][]openai.ChatCompletionMessage)
var mu sync.Mutex

// @Security Bearer
// @Summary GenerateContent
// @Description Generate content based on the given prompt
// @Tags generate
// @Accept  json
// @Produce  json
// @Param question body models.Question true "Question to get answer for"
// @Success 200 {object} map[string]string
// @Router /api/generate/gpt [post]
func GeneratePythonHandler(ctx context.Context, userID string, prompt string) (string, error) {
	if userID == "" {
		return "", errors.New("user ID is required")
	}

	mu.Lock()
	// Инициализируем историю с systemPrompt, если пользователь новый
	if _, ok := chatHistories[userID]; !ok {
		chatHistories[userID] = []openai.ChatCompletionMessage{
			{
				Role: "system",
				Content: "You are a helpful assistant named UniBot for a university application support website. " +
					"You help users generate motivational and recommendation letters. " +
					"Reply in the same language as the user's message. Do not mention you are from OpenAI.",
			},
		}
	}
	history := chatHistories[userID]
	mu.Unlock()

	// Генерация ответа
	answer, err := generateChatgpt(ctx, prompt, history)
	if err != nil {
		log.Printf("[Generate] Error generating GPT response: %v", err)
		return "", err
	}

	mu.Lock()
	chatHistories[userID] = append(history,
		openai.ChatCompletionMessage{Role: "user", Content: prompt},
		openai.ChatCompletionMessage{Role: "assistant", Content: answer},
	)

	// Опционально: ограничим историю до последних 20 сообщений (10 пар)
	const maxHistory = 20
	if len(chatHistories[userID]) > maxHistory {
		chatHistories[userID] = chatHistories[userID][len(chatHistories[userID])-maxHistory:]
	}
	mu.Unlock()

	return answer, nil
}

func generateChatgpt(ctx context.Context, question string, history []openai.ChatCompletionMessage) (string, error) {
	envConfig := config.GetEnvConfig()
	apiKey := envConfig.OpenAIAPIKey

	if apiKey == "" {
		log.Fatal("OPENAI_API_KEY not set in configuration")
	}

	client := openai.NewClient(apiKey)

	// Добавляем текущий вопрос к истории
	history = append(history, openai.ChatCompletionMessage{
		Role:    "user",
		Content: question,
	})

	request := openai.ChatCompletionRequest{
		Model:       "ft:gpt-4o-mini-2024-07-18:personal::AZePBB1d",
		Messages:    history,
		Temperature: 0.7,
		MaxTokens:   1500,
	}

	response, err := client.CreateChatCompletion(ctx, request)
	if err != nil {
		log.Printf("[OpenAI] Error while calling OpenAI: %v", err)
		return "", err
	}

	if len(response.Choices) == 0 {
		log.Println("[OpenAI] No choices returned in response")
		return "", errors.New("no response from OpenAI")
	}

	if response.Choices[0].FinishReason == "length" {
		log.Println("Response was cut off due to token limit")
	}

	log.Println("[OpenAI Response]", response.Choices[0].Message.Content)
	return response.Choices[0].Message.Content, nil
}

