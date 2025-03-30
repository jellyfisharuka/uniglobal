import ReactMarkdown from 'react-markdown';
import { cn, getUserGender } from "@/lib/utils";
import { components } from '@/constants/markdown';
import { TypingEffect } from '@/components/chat/typing-effect';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleLikeMessage } from '@/services/chatService';
import { toast } from 'sonner';

interface ChatMessageProps {
    content: string;
    role: 'user' | 'assistant';
    isNew?: boolean;
    messageId?: number;
    isLiked?: boolean;
    onLikeToggle?: (messageId: number, isLiked: boolean) => void;
}

export function ChatMessage({
    content,
    role,
    isNew = false,
    messageId,
    isLiked = false,
    onLikeToggle
}: ChatMessageProps) {
    const isUser = role === 'user';
    const [userGender, setUserGender] = useState<string>('male');
    const [liked, setLiked] = useState<boolean>(isLiked);
    const [isToggling, setIsToggling] = useState<boolean>(false);

    useEffect(() => {
        setUserGender(getUserGender());
    }, []);

    useEffect(() => {
        setLiked(isLiked);
    }, [isLiked]);

    const handleLikeToggle = async () => {
        if (isUser || !messageId || isToggling) return;

        try {
            setIsToggling(true);
            const response = await toggleLikeMessage(messageId);
            setLiked(response.is_liked);

            if (onLikeToggle) {
                onLikeToggle(messageId, response.is_liked);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            toast.error('Не удалось изменить статус избранного. Попробуйте еще раз.');
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div className="px-4 py-3">
            <div className="container max-w-4xl mx-auto">
                <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
                    <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden mt-1">
                        {isUser ? (
                            userGender === 'female' ? (
                                <Image
                                    src="/female.png"
                                    alt="User Avatar"
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Image
                                    src="/male.png"
                                    alt="User Avatar"
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            )
                        ) : (
                            <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                                <Image
                                    src="/logo-white.svg"
                                    alt="Assistant Avatar"
                                    width={24}
                                    height={24}
                                    className="w-5 h-5"
                                />
                            </div>
                        )}
                    </div>
                    <div className={cn(
                        "relative px-4 py-2.5 rounded-2xl max-w-[80%] group",
                        isUser ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none hover:shadow-md transition-shadow"
                    )}>
                        {isUser || !isNew ? (
                            <ReactMarkdown components={components}>
                                {content}
                            </ReactMarkdown>
                        ) : (
                            <TypingEffect text={content} speed={5} />
                        )}

                        {!isUser && (
                            <button
                                onClick={handleLikeToggle}
                                disabled={isToggling || !messageId}
                                className={cn(
                                    "absolute -top-1 -right-1 p-1.5 rounded-full transition-all shadow-sm",
                                    liked
                                        ? "bg-white text-red-500 border border-red-100"
                                        : "bg-white text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-400 border border-gray-100"
                                )}
                            >
                                <Heart className={cn("h-4 w-4", liked && "fill-red-500")} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}