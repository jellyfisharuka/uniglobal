'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { School } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
            <div className="text-center">
                <School className="w-24 h-24 mx-auto mb-8 text-[#000066]" />
                <h1 className="text-9xl font-bold text-[#000066] mb-4">404</h1>
                <h2 className="text-2xl font-medium text-gray-800 mb-6">
                    Страница не найдена
                </h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                    Похоже, вы забрели не туда. Давайте вернемся к обучению!
                </p>
                <div className="flex flex-col gap-5 justify-center">
                    <Button asChild className="bg-[#000066]">
                        <Link href="/">Вернуться на главную</Link>
                    </Button>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        Назад
                    </Button>
                </div>
            </div>
        </div>
    )
}