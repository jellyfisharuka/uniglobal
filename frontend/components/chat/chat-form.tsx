'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChatStore } from "@/stores/chat-store";
import Image from "next/image";
import { ArrowUp } from "lucide-react";

export default function ChatForm() {
    const { input, setInput, sendMessage, isLoading } = useChatStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        sendMessage(input)
    }

    return (
        <div className="p-6 w-7/12 mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Напишите свой запрос..."
                    className="pr-12 rounded-xl p-5"
                    disabled={isLoading}
                />
                <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-lg bg-[#000066] hover:bg-[#000044]"
                >
                    {input.trim() || isLoading ?
                        <ArrowUp />
                        :
                        <Image src='/logo-white.svg' fill alt="Logo" className="ml-[3px] -mt-[1px]" />
                    }
                </Button>
            </form>
        </div>
    )
}