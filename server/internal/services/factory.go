package service

import (
	"github.com/stilln0thing/JobFynxAI/backend/internal/repository"
)

type ServiceFactory struct {
	User UserService
	Interview InterviewService
	Resume ResumeService
}

func NewServiceFactory(repos *repository.RepositoryFactory) *ServiceFactory {
	return &ServiceFactory{
		User: NewUserService(repos.User),
		Interview: NewInterviewService(repos.Interview),
		Resume: NewResumeService(repos.Resume),
	}
}