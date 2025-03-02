package handlers

/*// @Security Bearer
// GenerateHandler godoc
// @Summary GenerateContent
// @Description Generate content based on the given prompt
// @Tags generate
// @Accept x-www-form-urlencoded
// @Produce plain
// @Param prompt formData string true "Prompt"
// @Success 200 {string} string "Generated content"
// @Failure 500 {string} string "Internal Server Error"
// @Router /api/generate/gemini [post]
func GenerateHandler(c *gin.Context, llm *googleai.GoogleAI) (string, error) {
	
	prompt, exists := c.Get("prompt")

	if !exists {
		// Если в контексте нет prompt, пытаемся получить его из формы
		prompt = c.PostForm("prompt")
	}

	promptStr, ok := prompt.(string)
    if !ok || promptStr == "" {
        errMsg := "prompt is required and must be a non-empty string"
        log.Printf("ERROR: %s - %s\n", errMsg, c.Request.URL.Path) // Log the error with the request path
        return "", fmt.Errorf(errMsg)
    }

    // Log that we received a valid prompt
    log.Printf("INFO: Received prompt: %s - %s\n", promptStr, c.Request.URL.Path)

	content := []llms.MessageContent{
		{
			Role: schema.ChatMessageTypeHuman,
			Parts: []llms.ContentPart{
				llms.TextPart(promptStr),
			},
		},
	}
    var generatedAnswer string
	_, err := llm.GenerateContent(c.Request.Context(), content,
		llms.WithModel("gemini-1.5-flash"),
		llms.WithMaxTokens(500),
		llms.WithStreamingFunc(func(ctx context.Context, chunk []byte) error {
			generatedAnswer += string(chunk)
			return nil
		}),
	)
	if err != nil {
		log.Printf("ERROR: Failed to generate content for prompt '%s': %v\n", promptStr, err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to generate content"})
        return "", err
		
	}
	//return generatedAnswer, nil
	c.JSON(http.StatusOK, gin.H{"generated_content": generatedAnswer})
	return generatedAnswer, nil
} */
