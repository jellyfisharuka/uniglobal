'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { getUserLetters, Letter } from "@/services/letterService";
import { truncateText } from "@/lib/chat-utils";

export function LettersHistory() {
    const [letters, setLetters] = useState<Letter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchLetters = async () => {
            try {
                setIsLoading(true);
                const data = await getUserLetters();
                setLetters(data);
            } catch (error) {
                console.error('Error fetching letters:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLetters();
    }, []);

    const getLetterTitle = (letter: Letter) => {
        const typePrefix = letter.letter_type === 'motivational'
            ? 'Мотивационное письмо'
            : 'Рекомендательное письмо';

        return `${typePrefix} - ${letter.program}`;
    }

    return (
        <>
            <div className={`${isHistoryOpen ? 'w-72' : 'w-0'} bg-white border-r overflow-hidden flex flex-col rounded-r-3xl transition-all duration-300`}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-medium">Письма</h2>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 pt-1"
                            onClick={() => router.push('/dashboard/letters')}
                            title="Создать новое письмо"
                        >
                            <Image src="/icons/edit.png" alt="Edit" width={26} height={26} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsHistoryOpen(false)}
                        >
                            <Image
                                src="/icons/arrow.png"
                                alt="Close"
                                width={16}
                                height={16}
                            />
                        </Button>
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {isLoading ? (
                            <div className="flex justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : letters.length > 0 ? (
                            letters.map((letter) => (
                                <Link
                                    key={letter.id}
                                    href={`/dashboard/letters/results/${letter.id}`}
                                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${pathname === `/dashboard/letters/results/${letter.id}`
                                        ? 'bg-gray-100'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-4 h-4 mt-1 flex-shrink-0 text-blue-500" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate">
                                                {letter.letter_type === 'motivational'
                                                    ? 'Мотивационное письмо'
                                                    : 'Рекомендательное письмо'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {truncateText(letter.program)}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {format(new Date(letter.created_at), 'dd MMM yyyy', { locale: ru })}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 p-3 text-center">
                                У вас пока нет писем
                            </p>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {!isHistoryOpen && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsHistoryOpen(true)}
                    className="fixed left-20 top-4 h-8 w-8 rotate-180"
                >
                    <Image src="/icons/arrow.png" alt="Open" width={16} height={16} />
                </Button>
            )}
        </>
    );
}