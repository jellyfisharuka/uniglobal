package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type EnvConfig struct {
	DbDSN string
}

var envConfig EnvConfig

func LoadEnvConfig(envPath string) error {

	err := godotenv.Load(envPath)
	if err != nil {
		log.Println("Error loading .env file, falling back to system environment variables")
	}

	//envConfig.DbDSN = os.Getenv("DB")
	envConfig.DbDSN = os.Getenv("DB")
	return nil
}

func GetEnvConfig() *EnvConfig {
    return &envConfig
}