package config

import (
	"encoding/json"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type EnvConfig struct {
	DbDSN string
    OpenAIAPIKey string
	
}

type GmailConfig struct {
	ClientID string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
}

var gmailConfig GmailConfig
var envConfig EnvConfig

func LoadEnvConfig(envPath string) error {

	err := godotenv.Load(envPath)
	if err != nil {
		log.Println("Error loading .env file, falling back to system environment variables")
	}

	envConfig.DbDSN = os.Getenv("DB")
	envConfig.OpenAIAPIKey = os.Getenv("OPENAI_API_KEY")
	return nil
}

func GetEnvConfig() *EnvConfig {
    return &envConfig
}

func LoadGmailConfig(gmailPath string) error {
	file, err := os.Open(gmailPath)
	if err!=nil {
		return err
	}
	defer file.Close()
	decoder := json.NewDecoder(file)
	return decoder.Decode(&gmailConfig)
}

func GetGmailConfig() *GmailConfig {
	return &gmailConfig
}