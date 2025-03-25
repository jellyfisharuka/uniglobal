package handlers

import (
	"bytes"
	"fmt"
	"net/http"
	"uniglobal/internal/db"
	"uniglobal/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/jung-kurt/gofpdf"
)

// @Security Bearer
// @Security GoogleOAuth
// @Summary Скачать PDF с текстом
// @Description Принимает текст и возвращает PDF-файл для скачивания
// @Tags pdf
// @Produce application/pdf
// @Param text query string true "Текст для генерации PDF"
// @Success 200 {file} application/pdf
// @Failure 400 {object} map[string]string "Ошибка: текст не передан"
// @Failure 500 {object} map[string]string "Ошибка: не удалось создать PDF"
// @Router /download-pdf [get]
func GeneratePDFHandler(c *gin.Context) {
	userID, exists := c.Get("ID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}
	var user models.User
	
	if err := db.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	text := c.Query("text")
	if text == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Text is required"})
		return
	}

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "", 14)
	pdf.MultiCell(190, 10, text, "", "L", false)

	var buf bytes.Buffer
	err := pdf.Output(&buf)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF"})
		return
	}
    fileName := fmt.Sprintf("letter_%s_%s.pdf", user.FirstName, user.LastName)
	c.Header("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, fileName))
	c.Header("Content-Type", "application/pdf")
	c.Data(http.StatusOK, "application/pdf", buf.Bytes())
}