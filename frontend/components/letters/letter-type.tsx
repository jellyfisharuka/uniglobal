import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { LetterType, useLettersStore } from "@/stores/letters-store"

export function LetterTypeStep() {
    const { letterType, setLetterType, nextStep } = useLettersStore();

    const handleTypeChange = (value: string) => {
        setLetterType(value as LetterType);
        nextStep();
    }

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <h1 className="text-xl text-center text-[#000066]">
                Какое письмо вам нужно?
            </h1>

            <div className="w-10/12 mx-auto">
                <RadioGroup
                    value={letterType || undefined}
                    onValueChange={handleTypeChange}
                    className="space-y-4"
                >
                    <div className="border rounded-lg hover:bg-gray-50/80 transition-colors">
                        <Label
                            htmlFor="motivational"
                            className="flex items-center w-full p-4 cursor-pointer"
                        >
                            <RadioGroupItem
                                value="motivational"
                                id="motivational"
                                className="border-[#000066] data-[state=checked]:border-[#000066] data-[state=checked]:bg-[#000066]"
                            />
                            <span className="ml-3 text-sm">Мотивационное письмо</span>
                        </Label>
                    </div>

                    <div className="border rounded-lg hover:bg-gray-50/80 transition-colors">
                        <Label
                            htmlFor="recommendation"
                            className="flex items-center w-full p-4 cursor-pointer"
                        >
                            <RadioGroupItem
                                value="recommendation"
                                id="recommendation"
                                className="border-[#000066] data-[state=checked]:border-[#000066] data-[state=checked]:bg-[#000066]"
                            />
                            <span className="ml-3 text-sm">Рекомендательное письмо</span>
                        </Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    )
}