import { useLettersStore } from "@/stores/letters-store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import Image from "next/image";

export function AchievementsStep() {
    const { nextStep, setAchievements, achievements } = useLettersStore();
    const [value, setValue] = useState(achievements || "");

    const handleSubmit = () => {
        if (!value.trim()) return;
        setAchievements(value.trim());
        nextStep();
    }

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <h1 className="w-10/12 mx-auto text-xl text-center text-[#000066]">
                Какие достижения в школе или в жизни вы считаете важными для поступления?
            </h1>
            <div className="relative w-full">
                <div className="w-10/12 mx-auto relative">
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Напишите развернутый ответ"
                        className="w-full h-10 border-[#000066] bg-gray-50/80 focus-visible:ring-0 focus-visible:ring-offset-0 pr-12"
                    />
                    <Button
                        size="icon"
                        onClick={handleSubmit}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 shrink-0 rounded-full bg-[#000066] hover:bg-[#000066]/90"
                        disabled={!value.trim()}
                    >
                        <Image src='/logo-white.svg' fill alt="Logo" className="ml-[2px] -mt-[1px] p-1" />
                    </Button>
                </div>
            </div>

            <div className="w-10/12 mx-auto text-sm text-gray-600">
                <h3 className="font-medium mb-2 text-[13px]">Пример ответа</h3>
                <p className="leading-relaxed text-[12px]">
                    Я победил в областной олимпиаде по математике, а также активно участвую в школьных проектах по робототехнике. Это помогает мне развивать не только знания, но и лидерские качества, работая в команде.
                </p>
            </div>
        </div>
    )
}