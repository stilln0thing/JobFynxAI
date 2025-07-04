package services

import(
	"context"
	"os"
	"strconv"
	"strings"
	"regexp"
	"log/slog"
	"github.com/stilln0thing/JobFynxAI/server/internal/core"
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
	"github.com/tmc/langchaingo/documentloaders"
	"encoding/json"

)

const RESUME_SYSTEM_PROMPT = `You are an AI assistant whose sole purpose is to prepare, in JSON only (no extra text or formatting), both:
A concise resume summary for a Senior Software Engineer candidate, divided into:
Candidate Details: name and total industry experience
Top 5 Technologies: ranked by relevance to this role

Projects / Work Experience: exactly 3 items, each with project name, your role, and key tech stack

Achievements: only those directly related to software engineering
A 30 minute interview plan broken into six consecutive sections:

Introduction (1 min)
Core Computer Science Concepts (5 min)
Technologies from Résumé (10 min)
Project 1 Deep Dive (5 min)
Project 2 Deep Dive (5 min)

Behavioral Questions (4 min)
For each section, generate a list of individual, single focused questions with:
A clear prompt,
A followup question that probes deeper (“how” or “why”),
A brief ideal answer guideline.

Rules
Do not label questions with section headers—just output them in order.
Use each technology, project name, or concept exactly as it appears in the résumé when deriving questions.
No compound or ambiguous questions.
Output only valid JSON; do not wrap it in markdown or plain text.`

type ResumeService struct {
	Client 			openai.Client
	Model 			string
	ResumeSchema	interface{}
}

func NewResumeService(apiKey string, modelName string) *ResumeService {
	client := openai.NewClient(option.WithAPIKey(apiKey),
	 	option.WithBaseURL("https://api.groq.com/openai/v1"),
	)
	resumeResponseSchema := core.GenerateSchema[models.InterviewPrep]()
	return &ResumeService{Client: client, Model: modelName, ResumeSchema: resumeResponseSchema}
}

func (r *ResumeService) GetSummary(fileName string, filePath string) (*models.Resume, error) {
	slog.Info("File : "+ fileName)
	slog.Info("File Path : "+ filePath)
	resumeContent, err := r.getResumeContent(filePath)
	if err != nil {
		slog.Error("Unable to get resume content from file : "+ filePath)
		return nil, err
	}

	schemaParam := openai.ResponseFormatJSONSchemaJSONSchemaParam{
		Name :		"resume",
	    Description: openai.String("Resume of the candidate"),
		Schema: 	r.ResumeSchema,
		Strict: 	openai.Bool(true),
	}

	params := openai.ChatCompletionNewParams{
		Model: r.Model,
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(RESUME_SYSTEM_PROMPT),
			openai.UserMessage(resumeContent),
		},
		ResponseFormat: openai.ChatCompletionNewParamsResponseFormatUnion{
			OfJSONSchema: &openai.ResponseFormatJSONSchemaParam{
				JSONSchema: schemaParam,
			},
		},
	}
	chatCompletion, err := r.Client.Chat.Completions.New(context.TODO(), params)
	if err != nil {
		return nil, err
	}

	summary := chatCompletion.Choices[0].Message.Content
	slog.Info("INTERVIEW PREP : " + summary)
	var interviewPrep models.InterviewPrep
	err = json.Unmarshal([]byte(summary), &interviewPrep)
	if err != nil {
		return nil, err
	}
	return &interviewPrep.Resume, nil
}

func (r *ResumeService) getResumeContent(filePath string) (string, error) {
	file,err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	fileInfo,err := file.Stat()
	if err != nil {
		return "", err
	}
	fileSize := fileInfo.Size()

	pdf := documentloaders.NewPDF(file, fileSize)

	docs, err := pdf.Load(context.Background())
	if err != nil {
		return "", err
	}
	fullContent := ""
	slog.Info("No of pages in resume : " + strconv.Itoa(len(docs)))
	for _, doc := range docs {
		fullContent = fullContent + doc.PageContent
	}
	fullContent = strings.ReplaceAll(fullContent, "\r\n", "")
	fullContent = strings.ReplaceAll(fullContent, "\n", "")
	fullContent = strings.TrimSpace(fullContent)
	fullContent = strings.TrimRight(fullContent, "\r\n")
	reg, err := regexp.Compile("[^a-zA-Z0-9]+")
	if err != nil {
		return "", err
	}
	return reg.ReplaceAllString(fullContent, ""), nil
}