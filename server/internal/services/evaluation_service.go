package services

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
	"github.com/stilln0thing/JobFynxAI/server/internal/core"
	"github.com/stilln0thing/JobFynxAI/server/internal/models"
)

const EVALUATION_SYSTEM_PROMPT = `You are an AI assistant whose sole purpose is to evaluate a candidate's interview performance for a given role. You will be provided:

1. **Role** (e.g. “Software Engineer”)  
2. **Candidate Resume** (structured text)  
3. **Interview Transcript**: a JSON array of messages. Each message has:
   - role: "assistant" for the interviewers questions, "user" for the candidate's answers  
   - content: the full text of that question or answer  
   - created_at: timestamp string  

**Your task**  
1. **For each interviewer question**:  
   - Determine if it is a followup (by comparing to the previous question).  
   - Pair it with the candidate's answer (the very next "user" message).  
   - Assign a **question-answer rating** (1-5) based on correctness, depth, relevance.  
   - Provide a one sentence **improvement tip** for the candidate's answer.  

2. **After all Q&As** compute **four aspect ratings** (1-5):  
   1. **Technologies**: mastery of relevant tools/languages  
   2. **Projects**: depth of project discussion  
   3. **Communication**: clarity, structure, professionalism  
   4. **FollowUp Handling**: ability to pivot on followup questions  

3. **Overall Interview Rating**  
   - Average of the four aspect ratings, rounded to one decimal.  
   - **Recommendation**: "HIRE" if ≥ 3.0, else "NOT HIRE".  

4. **Overall Feedback**: a 4-5 sentence summary highlighting strengths and areas for improvement, aligned with the recommendation.

**Output Format**  
Return a single JSON object with:  
  json
{
  "qa_evaluations": [
    {
      "question": "<full question>",
      "answer": "<full answer>",
      "is_follow_up": true|false,
      "rating": 1-5,
      "improvement": "<one-sentence tip>"
    },
    … more entries …
  ],
  "aspect_ratings": {
    "technologies": 1-5,
    "projects": 1-5,
    "communication": 1-5,
    "follow_up_handling": 1-5
  },
  "overall_rating": X.X,
  "recommendation": "HIRE"|"NOT HIRE",
  "feedback": "<4-5 sentence summary>"
}
`

type EvaluationService struct {
	Client           openai.Client
	Model            string
	EvaluationSchema interface{}
}

func NewEvaluationService(apiKey string, modelName string) *EvaluationService {
	client := openai.NewClient(option.WithAPIKey(apiKey))
	evaluationSchema := core.GenerateSchema[models.Evaluation]()
	return &EvaluationService{Client: client, Model: modelName, EvaluationSchema: evaluationSchema}
}

func (e *EvaluationService) EvaluateInterview(interview *models.Interview) (*models.Evaluation, error) {
	if &interview.ResumeSummary == nil || interview.Transcript == nil {
		return nil, errors.New("Both resume summary and transcript are required to evaluate interview : " + interview.ID)
	}
	role := "Role = Software Engineer"
	resumeBytes, err := json.Marshal(interview.ResumeSummary)
	if err != nil {
		return nil, err
	}
	transcriptBytes, err := json.Marshal(interview.Transcript)
	if err != nil {
		return nil, err
	}
	userMessage := role + string(resumeBytes) + string(transcriptBytes)

	schemaParam := openai.ResponseFormatJSONSchemaJSONSchemaParam{
		Name:        "resume",
		Description: openai.String("Evaluation of the interview"),
		Schema:      e.EvaluationSchema,
		Strict:      openai.Bool(true),
	}
	slog.Info("Evaluating interview...")
	params := openai.ChatCompletionNewParams{
		Model: e.Model,
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(EVALUATION_SYSTEM_PROMPT),
			openai.UserMessage(userMessage),
		},
		ResponseFormat: openai.ChatCompletionNewParamsResponseFormatUnion{
			OfJSONSchema: &openai.ResponseFormatJSONSchemaParam{
				JSONSchema: schemaParam,
			},
		},
	}
	chatCompletion, err := e.Client.Chat.Completions.New(context.TODO(), params)
	if err != nil {
		return nil, err
	}
	evaluationString := chatCompletion.Choices[0].Message.Content
	slog.Info("Evaluation complete. Converion to object pending.")
	var evaluation models.Evaluation
	err = json.Unmarshal([]byte(evaluationString), &evaluation)
	if err != nil {
		return nil, err
	}
	return &evaluation, nil
}

// this is the evalauation service
