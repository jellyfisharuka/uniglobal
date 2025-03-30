'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { logout } from "@/services/authService"
import { toast } from "sonner"

export default function LogoutPage() {
    const router = useRouter();

    const handleLogout = () => {
        logout();
        toast.success('You have successfully logged out!');
        router.push('/');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50" />

                <div className="relative space-y-8">
                    <div className="space-y-4 text-center">
                        <div className="flex justify-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#000066] to-blue-600 rounded-2xl rotate-12 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white rounded-xl -rotate-12 flex items-center justify-center">
                                    <Image src='/logo.svg' alt="Logo" width={50} height={50} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-[#000066]">
                                Уже уходите? 🥺
                            </h1>
                            <p className="mt-2 text-gray-600 max-w-md mx-auto">
                                Не хотите остаться и узнать больше о возможностях обучения за границей?
                                Мы только начали наше путешествие!
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            size="lg"
                            onClick={() => router.back()}
                            className="sm:flex-1 bg-navy-900 hover:opacity-90 transition-opacity"
                        >
                            Остаться и Продолжить
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleLogout}
                            className="sm:flex-1 border-2 hover:bg-gray-50"
                        >
                            Выйти
                        </Button>
                    </div>

                    <p className="text-sm text-center text-gray-500">
                        Помните, ваш прогресс будет сохранен, и вы всегда можете вернуться,
                        чтобы продолжить с того места, где остановились 💫
                    </p>
                </div>
            </Card>
        </div>
    )
}