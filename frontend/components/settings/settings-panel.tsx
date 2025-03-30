'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSettingsStore } from '@/stores/settings-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'
import { changePassword, updateUserProfile } from '@/services/userService'
import { toast } from 'sonner'

const profileFormSchema = z.object({
    firstName: z.string().min(2, 'Минимум 2 символа').max(50),
    lastName: z.string().min(2, 'Минимум 2 символа').max(50),
    gender: z.enum(['male', 'female']),
    city: z.string().min(2, 'Выберите город'),
    telephone: z.string().optional(),
    email: z.string().email('Введите корректный email').optional(),
})

const passwordFormSchema = z.object({
    old_password: z.string().min(6, 'Минимум 6 символов'),
    new_password: z.string().min(6, 'Минимум 6 символов'),
    confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Пароли не совпадают",
    path: ["confirm_password"],
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function SettingsPanel() {
    const {
        isOpen,
        activeTab,
        profile,
        setActiveTab,
        toggleSettings,
        updateProfile
    } = useSettingsStore()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            gender: profile.gender,
            city: profile.city,
            telephone: profile.phone,
            email: profile.email
        },
    })

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            old_password: '',
            new_password: '',
            confirm_password: '',
        },
    })

    const onProfileSubmit = async (data: ProfileFormValues) => {
        console.log("Hello")
        try {
            setIsSubmitting(true)

            await updateUserProfile({
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                city: data.city,
                telephone: data.telephone,
                email: data.email
            })

            updateProfile({
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                city: data.city,
                phone: data.telephone || profile.phone,
                email: data.email || profile.email,
                fullName: `${data.firstName} ${data.lastName}`
            })

            toast.success('Профиль успешно обновлен')
        } catch (error) {
            console.error('Failed to update profile:', error)
            toast.error('Не удалось обновить профиль')
        } finally {
            setIsSubmitting(false)
        }
    }

    const onPasswordSubmit = async (data: PasswordFormValues) => {
        try {
            setIsSubmitting(true)

            await changePassword({
                old_password: data.old_password,
                new_password: data.new_password,
                confirm_password: data.confirm_password
            });

            passwordForm.reset()
            toast.success('Пароль успешно изменен')
        } catch (error) {
            console.error('Failed to change password:', error)
            toast.error('Не удалось изменить пароль')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={cn(
            "fixed inset-y-0 p-4 left-0 w-full lg:w-4/12 transform transition-all duration-300 z-30",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "lg:ml-[38%]"
        )}>
            <Card className="h-[calc(100vh-2rem)] w-full p-4 md:p-6 border-navy-900 overflow-y-auto bg-[#F1F1F1] shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <span className="text-xl font-semibold">Настройки</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSettings}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex gap-4 mb-8">
                    <Button
                        variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                        className='border'
                        onClick={() => setActiveTab('profile')}
                    >
                        Профиль
                    </Button>
                    <Button
                        variant={activeTab === 'account' ? 'secondary' : 'ghost'}
                        className='border'
                        onClick={() => setActiveTab('account')}
                    >
                        Аккаунт
                    </Button>
                </div>

                {activeTab === 'profile' ? (
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <Label className="text-sm text-gray-500">Фото профиля</Label>
                            <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden border border-black shadow-md">
                                <Image
                                    src={profile.gender === 'male' ? '/male.png' : '/female.png'}
                                    alt="Profile"
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Имя</Label>
                                <Input {...profileForm.register('firstName')} />
                                {profileForm.formState.errors.firstName && (
                                    <p className="text-sm text-red-500">
                                        {profileForm.formState.errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Фамилия</Label>
                                <Input {...profileForm.register('lastName')} />
                                {profileForm.formState.errors.lastName && (
                                    <p className="text-sm text-red-500">
                                        {profileForm.formState.errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Пол</Label>
                            <RadioGroup
                                defaultValue={profile.gender}
                                onValueChange={(value: 'male' | 'female') => profileForm.setValue('gender', value)}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Мужской</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">Женский</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input {...profileForm.register('email')} placeholder={profile.email} />
                            {profileForm.formState.errors.email && (
                                <p className="text-sm text-red-500">
                                    {profileForm.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Телефон</Label>
                            <Input {...profileForm.register('telephone')} placeholder={profile.phone} />
                            {profileForm.formState.errors.telephone && (
                                <p className="text-sm text-red-500">
                                    {profileForm.formState.errors.telephone.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Город</Label>
                            <Select
                                defaultValue={profile.city}
                                onValueChange={(value) => profileForm.setValue('city', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите город" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Алматы">Алматы</SelectItem>
                                    <SelectItem value="Астана">Астана</SelectItem>
                                    <SelectItem value="Шымкент">Шымкент</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#000066]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                        </Button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Текущий пароль</Label>
                                    <Input
                                        type="password"
                                        {...passwordForm.register('old_password')}
                                    />
                                    {passwordForm.formState.errors.old_password && (
                                        <p className="text-sm text-red-500">
                                            {passwordForm.formState.errors.old_password.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Новый пароль</Label>
                                        <Input
                                            type="password"
                                            {...passwordForm.register('new_password')}
                                        />
                                        {passwordForm.formState.errors.new_password && (
                                            <p className="text-sm text-red-500">
                                                {passwordForm.formState.errors.new_password.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Повторите пароль</Label>
                                        <Input
                                            type="password"
                                            {...passwordForm.register('confirm_password')}
                                        />
                                        {passwordForm.formState.errors.confirm_password && (
                                            <p className="text-sm text-red-500">
                                                {passwordForm.formState.errors.confirm_password.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#000066]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Обновление...' : 'Изменить пароль'}
                                </Button>
                            </div>
                        </form>
                        {/* <AccountFields /> */}
                    </div>
                )}
            </Card>
        </div>
    )
}