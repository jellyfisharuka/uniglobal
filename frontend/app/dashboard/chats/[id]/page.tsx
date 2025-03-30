'use client'

import { use, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatHistoryItem } from "@/components/chat/chat-history-item"
import Image from "next/image"
import { Chat, Message, ApiChat, formatChats, formatMessagesForDisplay, truncateText } from "@/lib/chat-utils"
import { getChat, getUserChats, sendMessage } from "@/services/chatService"
import { ArrowUp, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false)
    const [chats, setChats] = useState<Chat[]>([])
    const [currentChat, setCurrentChat] = useState<ApiChat | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSending, setIsSending] = useState<boolean>(false)
    const [newMessageId, setNewMessageId] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                const allChats = await getUserChats()
                const formattedChats = formatChats(allChats)
                setChats(formattedChats)

                const chatData = await getChat(parseInt(id))
                setCurrentChat(chatData)

                const formattedMessages = formatMessagesForDisplay(chatData.messages)
                setMessages(formattedMessages)
            } catch (error) {
                console.error("Failed to fetch data:", error)
                router.push('/chats')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData();
    }, [id, router]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isSending) return

        try {
            setIsSending(true)

            const userMessage: Message = {
                id: `user-temp-${Date.now()}`,
                content: input,
                role: 'user'
            }

            setMessages(prev => [...prev, userMessage])
            setInput("")

            const response = await sendMessage(parseInt(id), input)

            // Ensure we have a valid response structure
            const responseId = response.id || Date.now()

            const assistantMessage: Message = {
                id: `assistant-${responseId}`,
                content: response.answer || "Извините, произошла ошибка при генерации ответа.",
                role: 'assistant',
                messageId: responseId,
                isLiked: Boolean(response.is_liked)
            }

            setNewMessageId(assistantMessage.id)
            setMessages(prev => [...prev, assistantMessage])

            // Reset the new message ID after some time to stop the typing effect
            setTimeout(() => {
                setNewMessageId(null)
            }, 1000 * 60) // Reset after 1 minute
        } catch (error) {
            console.error("Error sending message:", error)
            setMessages(prev => [
                ...prev,
                {
                    id: `error-${Date.now()}`,
                    content: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.",
                    role: 'assistant'
                }
            ])
        } finally {
            setIsSending(false)
        }
    }

    const handleLikeToggle = (messageId: number, isLiked: boolean) => {
        setMessages(prev =>
            prev.map(message =>
                message.messageId === messageId
                    ? { ...message, isLiked }
                    : message
            )
        );
    };

    const toggleHistory = () => setIsHistoryOpen(!isHistoryOpen)

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-[#000066] rounded-full border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="h-screen flex">
            <div
                className={`${isHistoryOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-white border-r rounded-r-3xl overflow-hidden flex flex-col`}
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-medium">Чаты</h2>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 pt-1"
                            onClick={() => router.push('/dashboard/chats')}
                            title="Новый чат"
                        >
                            <Image src="/icons/edit.png" alt="New" width={26} height={26} />
                        </Button>
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
                                isActive={chat.id === id}
                                onClick={() => {
                                    router.push(`/dashboard/chats/${chat.id}`);
                                    if (window.innerWidth < 768) setIsHistoryOpen(false);
                                }}
                                onDelete={() => {
                                    const fetchChats = async () => {
                                        try {
                                            const response = await getUserChats();
                                            const formattedChats = formatChats(response);
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
                        {currentChat && currentChat.messages && currentChat.messages.length > 0
                            ? truncateText(currentChat.messages[0].prompt, 50)
                            : "Чат"}
                    </h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/dashboard/favorites')}
                        className="ml-auto h-8 w-8"
                        title="Избранное"
                    >
                        <Image src="/icons/favorites.png" alt="Favorites" width={20} height={20} />
                    </Button>
                </div>

                {/* Messages container */}
                <div className="flex-1 overflow-y-auto bg-gray-50" ref={scrollRef}>
                    <div className="py-4 max-w-4xl mx-auto px-4">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                                <Image src="/logo.svg" alt="Logo" width={40} height={40} className="mb-2" />
                                <p>Начните новый разговор</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    content={message.content}
                                    role={message.role}
                                    isNew={message.id === newMessageId}
                                    messageId={message.messageId}
                                    isLiked={Boolean(message.isLiked)}
                                    onLikeToggle={handleLikeToggle}
                                />
                            ))
                        )}

                        {isSending && (
                            <div className="flex justify-center my-4">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 w-10/12 md:w-8/12 lg:w-7/12 mx-auto">
                    <form onSubmit={handleSubmit} className="relative">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Напишите свой запрос..."
                            className="pr-12 rounded-lg p-5 shadow-sm focus:shadow-md transition-shadow"
                            disabled={isSending}
                        />
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!input.trim() || isSending}
                            className="absolute -right-[1px] top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-lg bg-[#000066] hover:bg-[#000044] transition-colors"
                        >
                            {input.trim() && !isSending ? (
                                <ArrowUp className="h-5 w-5 text-white" />
                            ) : (
                                <Image src='/logo-white.svg' width={20} height={20} alt="Logo" className="ml-[1px] -mt-[1px]" />
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}