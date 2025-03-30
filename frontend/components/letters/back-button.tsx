import { useLettersStore } from "@/stores/letters-store";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    const { prevStep } = useLettersStore();

    return (
        <button
            onClick={prevStep}
            className="flex items-center  text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
            <ArrowLeft className="h-4 w-4 mr-2 text-navy-900" />
            Предыдущий вопрос
        </button>
    )
}