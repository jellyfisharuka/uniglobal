package db

import (
	"context"
	"errors"
	"fmt"
	"log"
	//"uniglobal/internal/config"
	"uniglobal/internal/models"

	"time"

	//"os"

	"github.com/go-redis/redis/v8"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)
var (
	DB *gorm.DB
	RedisClient *redis.Client
	Ctx         = context.Background()
)

func ConnectDB() {
	var err error
	//dsn := os.Getenv("DB")
	//dsn := config.GetEnvConfig().DbDSN
	dsn := "postgresql://root:KLbOmqsrOKgkxneVf5jAS0mWYuHKQbl1@dpg-d06btjjuibrs73ee7r3g-a.oregon-postgres.render.com/chatbot_k3qg"
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to DB")
	}
	log.Println("Successfully connected to database")

	err = DB.AutoMigrate(models.Email{}, models.Role{}, models.User{}, models.FAQ{}, models.Chat{}, models.Message{}, models.CheckList{}, models.Letter{})
	if err != nil {
		panic("Failed to migrate DB schemas")
	}

	seedRoles()

	SeedChecklists(DB)

}
func InitRedis() {
    for i := 0; i < 5; i++ {
        RedisClient = redis.NewClient(&redis.Options{
            Addr: "localhost:6379",
            DB:   0,
        })

        err := RedisClient.Ping(Ctx).Err()
        if err == nil {
            log.Println("Successfully connected to Redis")
            return
        }

        log.Printf("Redis not ready, retrying... (%d/5)", i+1)
        time.Sleep(2 * time.Second)
    }
    log.Fatalf("Could not connect to Redis after retries")
} 

func seedRoles() {
	defaultRoles := []models.Role{
		{ID: 1, Name: "admin"},
		{ID: 2, Name: "user"},
	}

	for _, role := range defaultRoles {
		var existingRole models.Role
		result := DB.Where("name = ?", role.Name).First(&existingRole)

		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				if err := DB.Create(&role).Error; err != nil {
					log.Printf("Failed to create role %s: %v", role.Name, err)
				} else {
					log.Printf("Created default role: %s with ID: %d", role.Name, role.ID)
				}
			} else {
				log.Printf("Error checking for role %s: %v", role.Name, result.Error)
			}
		} else {
			log.Printf("Role already exists: %s with ID: %d", existingRole.Name, existingRole.ID)
		}
	}
}


func SeedChecklists(db *gorm.DB) error {
	checklists := []models.CheckList{
		{ID: 2, Name: "Чек-лист выбора университета и программы для поступления за границу", TypeID: 2, FileURL: "https://drive.google.com/file/d/1TYr9nPFMydETSkIbOgvNjVNdxahpQSqX/view?usp=drive_link"},
		{ID: 1, Name: "Общий чек-лист поступления за границу", TypeID: 1, FileURL: "https://drive.google.com/file/d/1G3yEzqSY9h-t4TTZLlOlxnO6L4ZezvqD/view?usp=drive_link"},
		{ID: 3, Name: "Чек-лист подготовки документов", TypeID: 3, FileURL: "https://drive.google.com/file/d/12pERfZ0vuLzdNxUeL6BlCBA954cQubb-/view?usp=drive_link"},
		{ID: 4, Name: "Чек-лист подготовки к IELTS/TOEFL", TypeID: 4, FileURL: "https://drive.google.com/file/d/1J94o7jTA7zLNUJXeOam2aSfrDRzszGFh/view?usp=drive_link"},
		{ID: 5, Name: "Чек-лист подготовки к пеерезду на учебу за границу", TypeID: 5, FileURL: "https://drive.google.com/file/d/14mYqJ1a-4EtR20oQXqo5tfWmvaOEM2kt/view?usp=drive_link"},
	}                                                                                            
	for _, checklist := range checklists {
		var existing models.CheckList
		// ищем по ID
		if err := db.First(&existing, checklist.ID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				if err := db.Create(&checklist).Error; err != nil {
					return fmt.Errorf("failed to insert checklist ID %d: %w", checklist.ID, err)
				}
			} else {
				return err 
			}
		}
	}

	return nil
}
