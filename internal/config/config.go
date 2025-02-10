package config

import (
	"encoding/json"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type EnvConfig struct {
	DbDSN string
}

var envConfig EnvConfig

type GmailConfig struct {
	ClientID string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
}
var gmailConfig GmailConfig

func LoadEnvConfig(envPath string) error {

	err := godotenv.Load(envPath)
	if err != nil {
		log.Println("Error loading .env file, falling back to system environment variables")
	}

	envConfig.DbDSN = os.Getenv("DB")
	log.Println("DB DSN:", envConfig.DbDSN) 
	return nil
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

func GetEnvConfig() *EnvConfig {
    return &envConfig
}