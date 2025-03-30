import { Chat } from '@/lib/chat-utils';

export default function RecentChatCard({
    chat,
    onClick
}: {
    chat: Chat;
    onClick: () => void;
}) {
    return (
        <div
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            onClick={onClick}
        >
            <p className="font-medium line-clamp-2">{chat.title}</p>
            <p className="text-sm text-gray-500 mt-2">
                {chat.created_at.toLocaleDateString()}
            </p>
        </div>
    )
}