import { useLettersStore } from "@/stores/letters-store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import Image from "next/image";

export function SubjectsStep() {
    const { nextStep, setSubjects, subjects } = useLettersStore();
    const [value, setValue] = useState(subjects || "");

    const handleSubmit = () => {
        if (!value.trim()) return;
        setSubjects(value.trim());
        nextStep();
    }

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <h1 className="text-xl text-center text-[#000066]">
                Какие школьные предметы вам особенно нравятся и почему?
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
                    Мне очень нравится математика, потому что она помогает мне решать сложные задачи и логически мыслить. Я также увлекаюсь физикой, так как она объясняет, как устроен наш мир и как можно использовать знания для создания технологий.
                </p>
            </div>
        </div>
    );
}