import { FileText } from "lucide-react";
import { Letter } from "@/types/chat";
import { ru } from "date-fns/locale";
import { format } from "date-fns";
import Link from "next/link";

interface LetterHistoryItemProps {
    letter: Letter;
    isActive: boolean;
}

export function LetterHistoryItem({ letter, isActive }: LetterHistoryItemProps) {
    return (
        <Link
            href={`/dashboard/letters/results/${letter.id}`}
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
        >
            <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">
                        {letter.title.substring(0, letter.title.length / 1.3) + '...'}
                    </p>
                    <p className="text-xs text-gray-500">
                        {format(letter.createdAt, 'dd MMM yyyy', { locale: ru })}
                    </p>
                </div>
            </div>
        </Link>
    )
}