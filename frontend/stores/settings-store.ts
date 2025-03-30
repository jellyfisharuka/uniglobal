import { create } from 'zustand';

interface UserProfile {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    gender: 'male' | 'female';
    phone: string;
    avatar: string;
}

interface SettingsState {
    isOpen: boolean;
    activeTab: 'profile' | 'account';
    profile: UserProfile;
    toggleSettings: () => void;
    setActiveTab: (tab: 'profile' | 'account') => void;
    updateProfile: (data: Partial<UserProfile>) => void;
    setProfile: (profile: UserProfile) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    isOpen: false,
    activeTab: 'profile',
    profile: {
        fullName: "Пользователь",
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
        city: "",
        gender: 'male',
        phone: "",
        avatar: "/male.png"
    },
    toggleSettings: () => set((state) => ({ isOpen: !state.isOpen })),
    setActiveTab: (tab) => set({ activeTab: tab }),
    updateProfile: (data) => set((state) => ({
        profile: { ...state.profile, ...data }
    })),
    setProfile: (profile) => set({ profile })
}));