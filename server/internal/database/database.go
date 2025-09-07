package database

import (
	"fmt"
	"log"
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB(host, port, user, password, dbname string) error{
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname =%s sslmode = disable",
    host, port, user, password, dbname)
    
	Db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil{
		return fmt.Errorf("failed to connect to the db: %v", err)
	}
	db := Db.Session(&gorm.Session{
    	PrepareStmt: true,
  	})
	err = db.AutoMigrate(
		&models.User{},
		&models.Interview{},
		// &models.Resume{},
	)
	if err != nil{
		return fmt.Errorf("failed to migrate database: %v",err)
	}
	DB = db
	log.Println("Database connected successfully")
	return nil
}

func GetDB() *gorm.DB {
	return DB
}