import { useLettersStore } from "@/stores/letters-store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateLetter } from "@/services/letterService";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function GoalsStep() {
    const { letterType, program, subjects, achievements, skills, setGoals, goals, reset } = useLettersStore();
    const [value, setValue] = useState(goals || "");
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!value.trim() || !letterType || !program) return;

        try {
            setIsGenerating(true);
            setGoals(value.trim());

            const data = {
                letterType,
                program,
                subjects: subjects || "",
                achievements: achievements || "",
                skills: skills || "",
                goals: value.trim()
            }

            const result = await generateLetter(data);

            reset();
            router.push(`/dashboard/letters/results/${result.id}`);
        } catch (error) {
            console.error('Error generating letter:', error);
            toast.error('Произошла ошибка при генерации письма. Пожалуйста, попробуйте еще раз.');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <h1 className="text-xl text-center text-[#000066]">
                Какие цели вы ставите перед собой на ближайшие 5 лет?
            </h1>
            <div className="relative w-full">
                <div className="w-10/12 mx-auto relative">
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Напишите развернутый ответ"
                        className="w-full h-10 border-[#000066] bg-gray-50/80 focus-visible:ring-0 focus-visible:ring-offset-0 pr-12"
                        disabled={isGenerating}
                    />
                    <Button
                        size="icon"
                        onClick={handleSubmit}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 shrink-0 rounded-full bg-[#000066] hover:bg-[#000066]/90"
                        disabled={!value.trim() || isGenerating}
                    >
                        {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                            <Image src='/logo-white.svg' fill alt="Logo" className="ml-[2px] -mt-[1px] p-1" />
                        )}
                    </Button>
                </div>
            </div>
            <div className="w-10/12 mx-auto text-sm text-gray-600">
                <h3 className="font-medium mb-2 text-[13px]">Пример ответа</h3>
                <p className="leading-relaxed text-[12px]">
                    Моя цель — получить диплом по специальности, стать специалистом в области разработки программного обеспечения и найти работу в крупной технологической компании, такой как Google или Apple.
                </p>
            </div>
        </div>
    )
}