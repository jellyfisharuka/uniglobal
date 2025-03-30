import { Feature } from "@/types/animation";

export const features: Feature[] = [
    {
        id: 1,
        title: "Полный список документов",
        description: "Узнайте, какие документы и шаги необходимы для успешного поступления за границу. Мы подробно объясним все этапы, от подачи заявки до получения визы.",
        image: "/features/documents-icon.png",
        bgColor: "#0A1E3D",
        imageSize: {
            width: 72,
            mdWidth: 72,
            imgWidth: 300
        },
        reverse: false
    },
    {
        id: 2,
        title: "Идеальная программа для вас",
        description: "Выберите страну, программу и тип визы, которые соответствуют вашим целям. Мы предложим варианты, основанные на ваших предпочтениях.",
        image: "/features/program-icon.png",
        bgColor: "#D9D9D9",
        textColor: "text-gray-700",
        imageSize: {
            width: 72,
            mdWidth: 72,
            imgWidth: 300
        },
        reverse: true
    },
    {
        id: 3,
        title: "Персональный помощник",
        description: "Заполните несколько вопросов в диалоге с нашим ботом, и получите индивидуальные рекомендации по выбору программ, документов и виз.",
        image: "/features/assistant-icon.png",
        bgColor: "#006A67",
        imageSize: {
            width: 72,
            mdWidth: 72,
            imgWidth: 300
        },
        reverse: false
    },
    {
        id: 4,
        title: "Письма",
        description: "Создавайте профессиональные мотивационные письма и резюме с помощью нашего простого интерфейса. Все для того, чтобы вы выделились среди других кандидатов.",
        image: "/features/letters-icon.png",
        bgColor: "#5B99A5",
        imageSize: {
            width: 72,
            mdWidth: 72,
            imgWidth: 300
        },
        reverse: true
    }
]