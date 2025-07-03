package config

import (
	"fmt"
	"github.com/spf13/viper"
)
type Config struct {
	Server ServerConfig 
	Database DatabaseConfig
}

type ServerConfig struct {
	Port string 
	Mode string
}

type DatabaseConfig struct {
	Host string
	Port string
	Username string
	Password string
	DBName string
}
// GetDSN returns the database connection string
func (c *DatabaseConfig) GetDSN() string {
    return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        c.Host, c.Port, c.Username, c.Password, c.DBName)
}

func LoadConfig() (*Config,error){
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	viper.SetDefault("SERVER_PORT","8080")
	viper.SetDefault("SERVER_MODE","debug")
	viper.SetDefault("DB_HOST","localhost")
	viper.SetDefault("DB_PORT","5432")
	viper.SetDefault("DB_USER","postgres")
	viper.SetDefault("DB_PASSWORD","@th@rvmitt@l1")
	viper.SetDefault("DB_NAME","jobfynxai")

	 if err := viper.ReadInConfig(); err != nil {
        if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
            return nil, fmt.Errorf("error reading config file: %w", err)
        }
    }

    config := &Config{
        Server: ServerConfig{
            Port: viper.GetString("SERVER_PORT"),
            Mode: viper.GetString("SERVER_MODE"),
        },
        Database: DatabaseConfig{
            Host:     viper.GetString("DB_HOST"),
            Port:     viper.GetString("DB_PORT"),
            Username: viper.GetString("DB_USER"),
            Password: viper.GetString("DB_PASSWORD"),
            DBName:   viper.GetString("DB_NAME"),
        },
    }

    return config, nil
}


func NewConfig() *Config {
	return &Config{
		Server: ServerConfig{
			Port: "8080",
			Mode: "debug", 
		},
		Database: DatabaseConfig{
			Host: "localhost",
			Port: "5432",
			Username: "postgres",
			Password: "@th@rvmitt@l1",	
			DBName: "jobfynxai",
		},
	}
}	