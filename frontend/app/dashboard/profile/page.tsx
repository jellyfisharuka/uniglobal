'use client'

import { useEffect, useState } from "react";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { Settings, Mail, Building2 } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getUserProfile } from "@/services/userService";
import { toast } from "sonner";

export default function ProfilePage() {
    const { toggleSettings, profile, setProfile, isOpen } = useSettingsStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const userData = await getUserProfile();
                console.log(userData)

                // Update the profile in the store
                setProfile({
                    fullName: `${userData.first_name} ${userData.last_name}`,
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    email: userData.email,
                    city: userData.city || "Не указано",
                    gender: userData.gender as 'male' | 'female',
                    phone: userData.telephone || "Не указано",
                    avatar: userData.gender === 'male' ? '/male.png' : '/female.png'
                });
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                toast.error("Не удалось загрузить данные профиля");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [setProfile]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-navy-900 rounded-full border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 z-50">
            <div className={cn(
                "fixed inset-0 bg-black/40 transition-opacity duration-300 ",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
                "z-20"
            )} onClick={toggleSettings} />
            <div className="h-[calc(100vh-2rem)] w-full flex flex-col lg:flex-row gap-6">
                <Card className={cn(
                    "h-full w-full lg:w-4/12 p-4 md:p-6 border-navy-900 transition-opacity duration-300",
                    "relative z-30 bg-white",
                    isOpen && "opacity-100"
                )}>
                    <div className="space-y-6">
                        <h1 className="text-xl font-semibold text-[#000066]">Личный кабинет</h1>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden border border-black">
                                <Image
                                    src={profile.avatar}
                                    alt="Profile"
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-lg font-medium mt-4">{profile.fullName}</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Email</p>
                                <div className="flex items-center space-x-2 border rounded p-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{profile.email}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Город</p>
                                <div className="flex items-center space-x-2 border rounded p-2">
                                    <Building2 className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{profile.city}</span>
                                </div>
                            </div>
                        </div>

                        {!isOpen && (
                            <Button
                                className="flex items-center w-full bg-navy-900 hover:bg-blue-900 py-2"
                                onClick={toggleSettings}
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                <span className="text-sm">Настройки</span>
                            </Button>
                        )}
                    </div>
                </Card>
                <div className="fixed inset-0 lg:relative lg:flex-1 z-20">
                    <SettingsPanel />
                </div>
            </div>
            <div className="lg:hidden">
                <SettingsPanel />
            </div>
        </div>
    )
}