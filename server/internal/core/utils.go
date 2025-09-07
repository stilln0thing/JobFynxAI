package core

import "github.com/invopop/jsonschema"

func GenerateSchema[T any]() interface{} {

	reflector := jsonschema.Reflector{
		AllowAdditionalProperties: false,
		DoNotReference:				 true,
	}
	var v T
	schema := reflector.Reflect(v)
	return schema
}

// generates the JSON Schema (in Go struct form) for the type T — which you can then serialize (marshal) to JSON format for use.