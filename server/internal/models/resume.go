package models


type Resume struct {
	Name 	   		string         `json:"name" jsonschema_desc:"The name of the candidate"`
	Projects 		[]Project      `json:"projects" jsonschema_desc:"The projects done by the cadidate"`
	Technologies    []string       `json:"technologies" jsonschema_desc:"The technologies the candidate has worked on"` 
	Experience 		[]string       `json:"experience" jsonschema_desc:"The work-ex of the candidate in years"`
	Achievements    []string	   `json:"achievements" jsonschema_desc:"candidate's achievements(if any)"`
}

type Project struct {
	Title 			string		   `json:"title" jsonschema_desc:"the title of the project"`
	Role			string		   `json:"role" jsonschema_desc:"the role of the candidate in the project"`
	Technologies	[]string       `json:"technologies" jsonschema_desc:"the technologies used in the project"`
	Company 		string		   `json:"company" jsonschema_desc:"the company for which the project was done"`
}

type InterviewPrep struct {
	Resume			Resume 		   	  `json:"resume"`
	Questions 		[]QuestionPrep	  `json:"questions"`
}

type QuestionPrep struct {
	Topic				string		`json:"topic" jsonschema_desc:"The topic on which the question belongs"`
	Question 			string		`json:"question" jsonschema_desc:"question"`
	GuidelinestoAnswer  []string	`json:"guidelinesToAnswer" jsonschema_desc:"the guidelines to answer the question"`
	FollowUps 			[]FollowUp  `json:"followups" jsonschema_desc:"the followups to a question"`
}

type FollowUp struct {
	Topic				string		`json:"topic" jsonschema_desc:"The topic to which this followup question belongs"`
	Question 			string		`json:"question" jsonschema_desc:"followup question"`
	GuidelinestoAnswer  []string	`json:"guidelinesToAnswer" jsonschema_desc:"the guidelines to answer the follow-up question"`
}