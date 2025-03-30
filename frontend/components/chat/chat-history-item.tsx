import { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { Chat } from "@/lib/chat-utils";
import { ru } from "date-fns/locale";
import { format } from "date-fns";
import { deleteChat } from "@/services/chatService";
import { ConfirmationDialog } from "../ui/confimation-dialog";

interface ChatHistoryItemProps {
    chat: Chat;
    isActive: boolean;
    onClick: () => void;
    onDelete?: () => void;
}

export function ChatHistoryItem({ chat, isActive, onClick, onDelete }: ChatHistoryItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            await deleteChat(Number(chat.id));
            setIsDeleteDialogOpen(false);
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Failed to delete chat:", error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <div
                onClick={onClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`relative w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer 
                    ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
                <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">
                            {chat.title}
                        </p>
                        <p className="text-xs text-gray-500">
                            {format(new Date(chat.created_at), 'dd MMM yyyy', { locale: ru })}
                        </p>
                    </div>

                    {isHovered && !isDeleting && (
                        <button
                            onClick={handleDeleteClick}
                            className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
                            aria-label="Удалить чат"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}

                    {isDeleting && (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    )}
                </div>
            </div>

            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Удалить чат?"
                description="Это действие нельзя отменить. Чат и все его сообщения будут удалены."
            />
        </>
    )
}