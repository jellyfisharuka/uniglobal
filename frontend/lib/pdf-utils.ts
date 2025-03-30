import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Letter } from '@/services/letterService';

/**
 * Creates and downloads a PDF of the letter content by rendering it to canvas first
 * This approach provides better support for Cyrillic text
 * 
 * @param letter Letter object containing content
 * @returns Filename of the created PDF
 */
export const generateLetterPDF = async (letter: Letter): Promise<string> => {
    try {
        const letterTypeLabel = letter.letter_type === 'motivational'
            ? 'Мотивационное письмо'
            : 'Рекомендательное письмо';

        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.width = '800px';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.padding = '40px';

        tempDiv.innerHTML = `
                <h1 style="font-size: 22px; margin-bottom: 20px; color: #000066;">${letterTypeLabel}</h1>
                <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${letter.content}</div>
        `;

        document.body.appendChild(tempDiv);

        const canvas = await html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        document.body.removeChild(tempDiv);

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;

        pdf.addImage(imgData, 'JPEG', imgX, 0, imgWidth * ratio, imgHeight * ratio);

        const filename = `${letterTypeLabel}_${letter.id.split('-')[0]}.pdf`;

        pdf.save(filename);

        return filename;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}