'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatHistoryItem } from "@/components/chat/chat-history-item"
import Image from "next/image"
import { getUserChats, createChat, sendMessage } from "@/services/chatService"
import { getUserProfile, UserProfile } from "@/services/userService"
import { Chat, formatChats } from "@/lib/chat-utils"
import { getGreeting } from "@/lib/greetings"
import RecentChatCard from "@/components/chat/recent-chats"
import { ChatInput } from "@/components/chat/chat-input"

export default function ChatsPage() {
    const [chats, setChats] = useState<Chat[]>([])
    const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const router = useRouter()

    // Fetch user profile and chats when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const profile = await getUserProfile();
                setUserProfile(profile);
            } catch (error) {
                console.error("Failed to fetch user profile:", error)
            }
        }

        const fetchChats = async () => {
            try {
                const response = await getUserChats()
                const formattedChats = formatChats(response, true)
                setChats(formattedChats)
            } catch (error) {
                console.error("Failed to fetch chats:", error)
            }
        }

        fetchUserData();
        fetchChats();
    }, [])

    const handleSubmit = async (text: string) => {
        if (!text.trim() || isLoading) return
        try {
            setIsLoading(true)
            // Create a new chat
            const newChat = await createChat()
            // Send the first message
            await sendMessage(newChat.id, text)
            // Redirect to the chat page
            router.push(`/dashboard/chats/${newChat.id}`)
        } catch (error) {
            console.error('Error creating chat:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleHistory = () => {
        setIsHistoryOpen(!isHistoryOpen)
    }

    // Get appropriate greeting based on time of day
    const greeting = getGreeting(userProfile?.first_name || 'Студент');

    return (
        <div className="h-screen flex">
            {/* Sidebar */}
            <div
                className={`${isHistoryOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-white border-r rounded-r-3xl overflow-hidden flex flex-col`}
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-medium">Чаты</h2>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={toggleHistory}
                        >
                            <Image
                                src="/icons/arrow.png"
                                alt="Close"
                                width={16}
                                height={16}
                            />
                        </Button>
                    </div>
                </div>
                <ScrollArea className="flex-1 py-2">
                    <div className="space-y-1 px-2">
                        {chats.map((chat) => (
                            <ChatHistoryItem
                                key={chat.id}
                                chat={chat}
                                isActive={false}
                                onClick={() => {
                                    router.push(`/dashboard/chats/${chat.id}`);
                                    if (window.innerWidth < 768) setIsHistoryOpen(false);
                                }}
                                onDelete={() => {
                                    const fetchChats = async () => {
                                        try {
                                            const response = await getUserChats();
                                            const formattedChats = formatChats(response, true);
                                            setChats(formattedChats);
                                        } catch (error) {
                                            console.error("Failed to fetch chats:", error);
                                        }
                                    }

                                    fetchChats();
                                }}
                            />
                        ))}
                        {chats.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                Нет чатов
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <div className="h-16 py-8 border-b flex items-center px-4">
                    {!isHistoryOpen && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleHistory}
                            className="mr-2 h-8 w-8 rotate-180"
                        >
                            <Image src="/icons/arrow.png" alt="Open" width={16} height={16} />
                        </Button>
                    )}
                    <h1 className="font-medium w-full text-center">
                        Новый чат
                    </h1>
                </div>
                <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
                    <div className="max-w-3xl w-full px-4 py-12">
                        <div className="flex items-center justify-center mb-8">
                            {greeting.icon}
                            <h2 className="text-2xl md:text-3xl font-semibold ml-2">
                                {greeting.text}
                            </h2>
                        </div>

                        <div className="text-center mb-12">
                            <div className="w-20 h-20 mx-auto mb-6">
                                <Image src="/logo.svg" alt="Logo" width={80} height={80} />
                            </div>
                            <h2 className="text-2xl font-semibold mb-4">
                                Что хотите узнать?
                            </h2>
                            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                                Задайте любой вопрос о поступлении за границу
                            </p>
                        </div>

                        <ChatInput
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            placeholder="Напишите свой запрос..."
                        />

                        {chats.length > 0 && (
                            <div className="mt-12">
                                <h3 className="text-lg font-medium mb-6 border-b pb-2">Недавние чаты</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {chats.slice(0, 3).map((chat) => (
                                        <RecentChatCard
                                            key={chat.id}
                                            chat={chat}
                                            onClick={() => router.push(`/dashboard/chats/${chat.id}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}