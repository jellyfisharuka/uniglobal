import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LetterType = 'motivational' | 'recommendation' | null;

interface LettersState {
    currentStep: number;
    letterType: LetterType;
    program: string | null;
    subjects: string | null;
    achievements: string | null;
    skills: string | null;
    goals: string | null;

    setLetterType: (type: LetterType) => void;
    setProgram: (text: string) => void;
    setSubjects: (text: string) => void;
    setAchievements: (text: string) => void;
    setSkills: (text: string) => void;
    setGoals: (text: string) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
}

const initialState = {
    currentStep: 1,
    letterType: null,
    program: null,
    subjects: null,
    achievements: null,
    skills: null,
    goals: null
};

export const useLettersStore = create<LettersState>()(
    persist(
        (set) => ({
            ...initialState,

            setLetterType: (type) =>
                set({ letterType: type }),

            setProgram: (text) =>
                set({ program: text }),

            setSubjects: (text) =>
                set({ subjects: text }),

            setAchievements: (text) =>
                set({ achievements: text }),

            setSkills: (text) =>
                set({ skills: text }),

            setGoals: (text) =>
                set({ goals: text }),

            nextStep: () =>
                set((state) => ({
                    currentStep: Math.min(state.currentStep + 1, 6)
                })),

            prevStep: () =>
                set((state) => ({
                    currentStep: Math.max(state.currentStep - 1, 1)
                })),

            reset: () =>
                set(initialState),
        }),
        {
            name: 'letters-storage',
        }
    )
);