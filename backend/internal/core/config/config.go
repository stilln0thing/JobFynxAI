package config

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
			Password: "postgres",	
			DBName: "jobfynxai",
		},
	}
}	