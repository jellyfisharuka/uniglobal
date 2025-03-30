'use client'

import { use, useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Copy, Download, Loader2 } from "lucide-react"
import Link from 'next/link'
import { getLetterById, Letter } from '@/services/letterService'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { toast } from 'sonner'
import { generateLetterPDF } from '@/lib/pdf-utils'

export default function LetterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [letter, setLetter] = useState<Letter | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    useEffect(() => {
        const fetchLetter = async () => {
            try {
                setIsLoading(true);

                const data = await getLetterById(id);
                setLetter(data);
            } catch (error) {
                console.error('Error fetching letter:', error)
                setError('Не удалось загрузить письмо. Пожалуйста, попробуйте позже.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchLetter()
    }, [id]);

    const copyToClipboard = async () => {
        if (!letter) return

        try {
            await navigator.clipboard.writeText(letter.content)
            setIsCopied(true)
            toast.success('Текст письма скопирован в буфер обмена')

            setTimeout(() => {
                setIsCopied(false)
            }, 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
            toast.error('Не удалось скопировать текст')
        }
    }

    const downloadPDF = async () => {
        if (!letter) return

        try {
            setIsDownloading(true)

            await generateLetterPDF(letter)
            toast.success(`PDF успешно загружен`)
        } catch (err) {
            console.error('Failed to download PDF: ', err)
            toast.error('Не удалось создать PDF')
        } finally {
            setIsDownloading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#000066]" />
            </div>
        )
    }

    if (error || !letter) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="p-6">
                        <CardTitle className="text-xl mb-4">Ошибка</CardTitle>
                        <p className="text-gray-600">{error || 'Письмо не найдено'}</p>
                        <Button asChild className="mt-4 bg-navy-900 hover:bg-navy-900/70">
                            <Link href='/dashboard/letters'>Вернуться к письмам</Link>
                        </Button>
                    </Card>
                </div>
            </div>
        )
    }

    const letterTypeLabel = letter.letter_type === 'motivational'
        ? 'Мотивационное письмо'
        : 'Рекомендательное письмо'

    const skillsList = letter.skills.split(',').map(skill => skill.trim()).filter(Boolean);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <Button
                    asChild
                    variant="ghost"
                    className="mb-8 text-gray-500 hover:text-gray-700"
                >
                    <Link href='/dashboard/letters'>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Назад
                    </Link>
                </Button>

                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <CardTitle>{letterTypeLabel} #{letter.id.split('-')[0]}</CardTitle>
                                <p className="text-sm text-gray-500">
                                    Создано: {format(new Date(letter.created_at), 'dd MMMM yyyy', { locale: ru })}
                                </p>
                            </div>
                            <Badge variant="outline" className="font-normal">
                                {letter.program}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 text-gray-700">
                            <div>
                                <h3 className="font-medium text-sm text-gray-500 mb-2">Программа</h3>
                                <p>{letter.program}</p>
                            </div>

                            {letter.achievements && (
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500 mb-2">Опыт и достижения</h3>
                                    <p>{letter.achievements}</p>
                                </div>
                            )}

                            {skillsList.length > 0 && (
                                <div>
                                    <h3 className="font-medium text-sm text-gray-500 mb-2">Навыки</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skillsList.map((skill, index) => (
                                            <Badge key={index} variant="secondary">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[#000066]">Текст письма</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                onClick={downloadPDF}
                                variant="outline"
                                size="sm"
                                className="transition-all"
                                disabled={isDownloading}
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Загрузка...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Скачать PDF
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                size="sm"
                                className="transition-all"
                            >
                                {isCopied ? (
                                    <>
                                        <Check className="h-4 w-4 mr-2 text-green-500" />
                                        Скопировано
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Копировать
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                                {letter.content}
                            </pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}