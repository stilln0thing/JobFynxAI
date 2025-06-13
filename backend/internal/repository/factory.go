package repository

type RepositoryFactory struct {
    User     UserRepository
    Interview InterviewRepository
    Resume   ResumeRepository
}

func NewRepositoryFactory() *RepositoryFactory {
    return &RepositoryFactory{
        User:     NewUserRepository(),
        Interview: NewInterviewRepository(),
        Resume:   NewResumeRepository(),
    }
}