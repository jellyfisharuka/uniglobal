'use client'

import { ProgressBar } from "@/components/letters/progress-bar"
import { LetterTypeStep } from "@/components/letters/letter-type"
import { ProgramInfoStep } from "@/components/letters/program-info"
import { useLettersStore } from "@/stores/letters-store"
import { SubjectsStep } from "@/components/letters/subjects-step"
import { AchievementsStep } from "@/components/letters/achievements-step"
import { SkillsStep } from "@/components/letters/skills-step"
import { GoalsStep } from "@/components/letters/goals-step"
import { LettersHistory } from "@/components/letters/letters-history"
import BackButton from "@/components/letters/back-button"

export default function LettersPage() {
    const { currentStep } = useLettersStore()

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <LettersHistory />
            <div className="flex-1 p-4 mt-10">
                <div className="max-w-4xl mx-auto">
                    <ProgressBar currentStep={currentStep} />
                    {currentStep !== 1 && <BackButton />}
                    <div className="rounded-lg p-8">
                        {currentStep === 1 && <LetterTypeStep />}
                        {currentStep === 2 && <ProgramInfoStep />}
                        {currentStep === 3 && <SubjectsStep />}
                        {currentStep === 4 && <AchievementsStep />}
                        {currentStep === 5 && <SkillsStep />}
                        {currentStep === 6 && <GoalsStep />}
                    </div>
                </div>
            </div>
        </div>
    )
}