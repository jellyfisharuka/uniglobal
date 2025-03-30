'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { loginSchema } from "@/schemas/auth"
import { login } from "@/services/authService"
import { toast } from "sonner"
import axios from "axios"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        try {
            setIsLoading(true);
            await login(data.username, data.password);
            toast.success("Login successful!");
            router.push('/dashboard/profile');
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.error || "Login failed");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleGoogleLogin = () => {
        // return;
        window.location.href = 'http://localhost:8080/googleLogin'
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
            <div className="relative w-full max-w-[440px]">
                <div className="absolute -left-3 -top-12">
                    <Button asChild variant="ghost" size="sm" className="hover:bg-gray-100 gap-2">
                        <Link href="/">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back Home
                        </Link>
                    </Button>
                </div>
                <Card className="w-full max-w-[440px] p-7">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center text-navy-900">ВХОД В СИСТЕМУ 🔐</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Имя пользователя:"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Введите пароль:"
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-gray-400" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-[#000066]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Загрузка..." : "Войти"}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-white px-2 text-gray-500">или</span>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="flex items-center justify-center"
                                    >
                                        <Image
                                            src="/google.webp"
                                            alt="Google"
                                            width={40}
                                            height={40}
                                            className="cursor-pointer hover:opacity-80 transition-opacity"
                                        />
                                    </button>
                                </div>

                                <div className="text-center">
                                    <span className="text-sm text-gray-600">Нет аккаунта? </span>
                                    <Link
                                        href="/register"
                                        className="text-sm text-navy-900 underline"
                                    >
                                        Регистрация
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}