package logger 

import (
	"go.uber.org/zap"
)

var log *zap.Logger

func Init() error {
	var err error 
	log, err = zap.NewProduction()
	if err !=nil{	
		return err
	}
	return nil
}

func GetLogger() *zap.Logger {
	return log
}