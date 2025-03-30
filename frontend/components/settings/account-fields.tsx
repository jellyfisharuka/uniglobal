'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Check, X } from 'lucide-react'
import { useSettingsStore } from '@/stores/settings-store'

const emailSchema = z.object({
    email: z.string().email('Неверный формат email'),
    confirmEmail: z.string()
}).refine((data) => data.email === data.confirmEmail, {
    message: "Email не совпадают",
    path: ["confirmEmail"],
})

const phoneSchema = z.object({
    phone: z.string().regex(/^\+7 \d{3} \d{3} \d{2} \d{2}$/, 'Формат: +7 XXX XXX XX XX'),
    confirmPhone: z.string()
}).refine((data) => data.phone === data.confirmPhone, {
    message: "Номера не совпадают",
    path: ["confirmPhone"],
})

export function AccountFields() {
    const { profile, updateProfile } = useSettingsStore();
    const [editingField, setEditingField] = useState<'email' | 'phone' | null>(null)

    const emailForm = useForm({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: '',
            confirmEmail: ''
        }
    })

    const phoneForm = useForm({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            phone: '',
            confirmPhone: ''
        }
    })

    const onEmailSubmit = (data: z.infer<typeof emailSchema>) => {
        updateProfile({ email: data.email })
        setEditingField(null)
        emailForm.reset()
    }

    const onPhoneSubmit = (data: z.infer<typeof phoneSchema>) => {
        updateProfile({ phone: data.phone })
        setEditingField(null)
        phoneForm.reset()
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Почта</Label>
                {editingField === 'email' ? (
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                placeholder="Новый email"
                                {...emailForm.register('email')}
                            />
                            {emailForm.formState.errors.email && (
                                <p className="text-sm text-red-500">
                                    {emailForm.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Input
                                placeholder="Подтвердите email"
                                {...emailForm.register('confirmEmail')}
                            />
                            {emailForm.formState.errors.confirmEmail && (
                                <p className="text-sm text-red-500">
                                    {emailForm.formState.errors.confirmEmail.message}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setEditingField(null)
                                    emailForm.reset()
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <Button type="submit" variant="ghost" size="sm">
                                <Check className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{profile.email}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingField('email')}
                        >
                            <Pencil className="h-4 w-4 text-gray-400" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label>Номер телефона</Label>
                {editingField === 'phone' ? (
                    <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                placeholder="+7 XXX XXX XX XX"
                                {...phoneForm.register('phone')}
                            />
                            {phoneForm.formState.errors.phone && (
                                <p className="text-sm text-red-500">
                                    {phoneForm.formState.errors.phone.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Input
                                placeholder="Подтвердите номер"
                                {...phoneForm.register('confirmPhone')}
                            />
                            {phoneForm.formState.errors.confirmPhone && (
                                <p className="text-sm text-red-500">
                                    {phoneForm.formState.errors.confirmPhone.message}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setEditingField(null)
                                    phoneForm.reset()
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <Button type="submit" variant="ghost" size="sm">
                                <Check className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{profile.phone}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingField('phone')}
                        >
                            <Pencil className="h-4 w-4 text-gray-400" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}