export interface ApiMessage {
    id: number;
    chat_id: number;
    prompt: string;
    answer: string;
    sender_id: number;
    created_at: string;
    is_liked: boolean;
}

export interface ApiChat {
    id: number;
    messages: ApiMessage[];
}

export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    messageId?: number;
    isLiked?: boolean;
}

export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    created_at: Date;
}

/**
 * Formats raw API chat data into a standardized Chat format
 * @param chatData Raw chat data from API
 * @param includeMessages Whether to include formatted messages in the result
 * @returns Formatted chat object
 */
export const formatChat = (chatData: ApiChat, includeMessages: boolean = false): Chat => {
    const title = chatData.messages.length > 0
        ? chatData.messages[0].prompt.substring(0, 30) + (chatData.messages[0].prompt.length > 30 ? '...' : '')
        : `Чат ${chatData.id}`;

    const created_at = chatData.messages.length > 0
        ? new Date(chatData.messages[0].created_at)
        : new Date();

    // Only format messages if requested
    const messages = includeMessages
        ? chatData.messages.map(msg => ({
            id: msg.id.toString(),
            content: msg.prompt,
            role: 'user' as const
        }))
        : [];

    return {
        id: chatData.id.toString(),
        title,
        messages,
        created_at
    };
}

/**
 * Formats multiple API chats
 * @param chats Array of raw API chat data
 * @param includeMessages Whether to include formatted messages in the results
 * @returns Array of formatted chat objects
 */
export const formatChats = (chats: ApiChat[], includeMessages: boolean = false): Chat[] => {
    return chats.map(chat => formatChat(chat, includeMessages));
}

/**
 * Formats chat messages for display in the chat UI
 * @param messages API message array
 * @returns Formatted messages array
 */
export function formatMessagesForDisplay(apiMessages: ApiMessage[]): Message[] {
    if (!apiMessages || !Array.isArray(apiMessages)) return [];

    const messages: Message[] = [];

    for (const msg of apiMessages) {
        messages.push({
            id: `user-${msg.id}`,
            content: msg.prompt,
            role: 'user',
            messageId: undefined,
            isLiked: false
        });

        messages.push({
            id: `assistant-${msg.id}`,
            content: msg.answer,
            role: 'assistant',
            messageId: msg.id,
            isLiked: msg.is_liked || false
        });
    }

    return messages;
}

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number = 30): string => {
    if (!text) return '';
    return text.length > maxLength
        ? `${text.substring(0, maxLength)}...`
        : text;
}