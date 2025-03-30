'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getFavoriteMessages, toggleLikeMessage } from "@/services/chatService"
import { ChevronLeft, Heart, Loader2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { components } from '@/constants/markdown'
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface FavoriteMessage {
    id: number;
    content: string;
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<FavoriteMessage[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [togglingIds, setTogglingIds] = useState<number[]>([])
    const router = useRouter()

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setIsLoading(true)
                const data = await getFavoriteMessages()
                console.log(data);
                setFavorites(data);
            } catch (error) {
                console.error("Failed to fetch favorites:", error)
                setFavorites([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchFavorites()
    }, [])

    const handleToggleFavorite = async (messageId: number) => {
        if (messageId === 0 || togglingIds.includes(messageId)) return

        try {
            setTogglingIds(prev => [...prev, messageId])

            await toggleLikeMessage(messageId)

            setFavorites(prev => prev.filter(msg => msg.id !== messageId))
            toast.success('Сообщение удалено из избранного')
        } catch (error) {
            console.error("Failed to toggle favorite:", error)
            toast.error('Не удалось удалить из избранного')
        } finally {
            setTogglingIds(prev => prev.filter(id => id !== messageId))
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8 flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="mr-4"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-semibold text-[#000066]">Избранные ответы</h1>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin h-8 w-8 border-3 border-[#000066] rounded-full border-t-transparent"></div>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <Heart className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Нет избранных ответов</h3>
                        <p className="text-gray-500 mb-6">Добавляйте ответы в избранное, нажимая на сердечко в чате</p>
                        <Button
                            onClick={() => router.push('/dashboard/chats')}
                            className="bg-[#000066] hover:bg-[#000044]"
                        >
                            Перейти к чатам
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {favorites.map((item, index) => (
                            <Card key={index} className="overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-start mb-4">
                                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                                            <Image
                                                src="/logo-white.svg"
                                                alt="Assistant Avatar"
                                                width={24}
                                                height={24}
                                                className="w-5 h-5"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600">Ассистент</span>
                                                {item.id !== 0 && (
                                                    <button
                                                        onClick={() => handleToggleFavorite(item.id)}
                                                        disabled={togglingIds.includes(item.id)}
                                                        className="p-1.5 rounded-full transition-all hover:bg-gray-100"
                                                        title="Удалить из избранного"
                                                    >
                                                        {togglingIds.includes(item.id) ? (
                                                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                                        ) : (
                                                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pl-11">
                                        <ReactMarkdown components={components}>
                                            {item.content}
                                        </ReactMarkdown>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}