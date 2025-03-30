import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
    onSubmit: (text: string) => Promise<void>;
    isLoading: boolean;
    placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSubmit,
    isLoading,
    placeholder = "Напишите свой запрос..."
}) => {
    const [input, setInput] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        await onSubmit(input);
        setInput("");

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto mb-8 px-4 sm:px-0">
            <div className="relative rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors">
                <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="resize-none pr-14 py-4 px-4 min-h-[60px] max-h-[200px] text-base md:text-lg focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
                    disabled={isLoading}
                    rows={1}
                />
                <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 bottom-2 h-10 w-10 p-0 rounded-lg bg-[#000066] hover:bg-[#000044] transition-colors"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    ) : (
                        <ArrowUp className="h-5 w-5 text-white" />
                    )}
                </Button>
            </div>
            <p className="hidden md:flex text-xs text-gray-500 mt-1 text-right">
                Нажмите Enter для отправки, Shift+Enter для новой строки
            </p>
        </form>
    )
}