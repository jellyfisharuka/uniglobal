import { useLettersStore } from "@/stores/letters-store";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";

export function ProgramInfoStep() {
    const { nextStep, setProgram, program } = useLettersStore();
    const [value, setValue] = useState(program || "");

    const handleSubmit = () => {
        if (!value.trim()) return;
        setProgram(value.trim());
        nextStep();
    }

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <div className="space-y-2">
                <h1 className="text-xl  text-center text-[#000066]">
                    На какую программу и в какой стране вы хотите поступить?
                </h1>
                <h2 className="text-xl text-center text-[#000066]">
                    Почему именно эта программа вас интересует?
                </h2>
            </div>

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

            <div className="w-10/12 mx-auto text-gray-600">
                <h3 className="font-medium mb-2 text-[13px]">Пример ответа</h3>
                <p className="leading-relaxed text-[12px]">
                    Я хочу поступить на программу бакалавриата по информационным технологиям в Университет Калифорнии,
                    потому что меня всегда интересовали новые технологии и их применение в реальной жизни. Я считаю, что этот
                    университет - один из лучших в мире, и обучение там поможет мне достичь моих целей.
                </p>
            </div>
        </div>
    )
}