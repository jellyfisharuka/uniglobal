import { ApiMessage, createChat, getUserChats, sendMessage } from '@/services/chatService';
import { toast } from 'sonner';
import { create } from 'zustand';

export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp?: Date;
}

export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    created_at: Date;
}

interface ChatStore {
    chats: Chat[];
    currentChatId: string | null;
    isHistoryOpen: boolean;
    input: string;
    isLoading: boolean;
    error: string | null;

    fetchChats: () => Promise<void>;
    setInput: (input: string) => void;
    sendMessage: (content: string) => void;
    setCurrentChat: (id: string) => void;
    toggleHistory: () => void;
    createNewChat: () => void;
}

const mapApiMessages = (apiMessages: ApiMessage[]): Message[] => {
    const messages: Message[] = [];

    apiMessages.forEach(msg => {
        messages.push({
            id: `user-${msg.id}`,
            content: msg.prompt,
            role: 'user',
            timestamp: new Date(msg.created_at)
        });

        if (msg.answer) {
            messages.push({
                id: `assistant-${msg.id}`,
                content: msg.answer,
                role: 'assistant',
                timestamp: new Date(msg.created_at)
            });
        }
    });

    return messages;
};

export const useChatStore = create<ChatStore>((set, get) => ({
    chats: [],
    currentChatId: null,
    isHistoryOpen: true,
    input: '',
    isLoading: false,
    error: null,

    fetchChats: async () => {
        try {
            set({ isLoading: true, error: null });
            const apiChats = await getUserChats();

            const frontendChats = apiChats.map(chat => ({
                id: chat.id.toString(),
                title: chat.messages.length > 0
                    ? chat.messages[0].prompt.substring(0, 30) + (chat.messages[0].prompt.length > 30 ? '...' : '')
                    : `Chat ${chat.id}`,
                messages: mapApiMessages(chat.messages),
                createdAt: chat.messages.length > 0
                    ? new Date(chat.messages[0].created_at)
                    : new Date()
            }));

            set({
                chats: frontendChats,
                currentChatId: frontendChats.length > 0 ? frontendChats[0].id : null,
                isLoading: false
            });
        } catch (error) {
            console.error('Failed to fetch chats:', error);
            set({ isLoading: false, error: 'Failed to load chats' });
            toast.error('Не удалось загрузить чаты');
        }
    },

    setInput: (input) => set({ input }),

    sendMessage: async (content) => {
        const { currentChatId, input } = get();
        const messageToSend = content || input;

        if (!messageToSend.trim()) return;

        set({ isLoading: true, input: '' });

        const tempUserMessage: Message = {
            id: `temp-${Date.now()}`,
            content: messageToSend,
            role: 'user',
            timestamp: new Date()
        };

        try {
            if (!currentChatId) {
                const newApiChat = await createChat();
                const newChatId = newApiChat.id.toString();

                const newChat: Chat = {
                    id: newChatId,
                    title: messageToSend.substring(0, 30) + (messageToSend.length > 30 ? '...' : ''),
                    messages: [tempUserMessage],
                    created_at: new Date()
                }

                set(state => ({
                    chats: [newChat, ...state.chats],
                    currentChatId: newChatId
                }));

                const response = await sendMessage(newApiChat.id, messageToSend);

                const assistantMessage: Message = {
                    id: `assistant-${Date.now()}`,
                    content: response.answer,
                    role: 'assistant',
                    timestamp: new Date()
                };

                set(state => ({
                    chats: state.chats.map(chat =>
                        chat.id === newChatId
                            ? { ...chat, messages: [...chat.messages, assistantMessage] }
                            : chat
                    ),
                    isLoading: false
                }));
            }
            else {
                set(state => ({
                    chats: state.chats.map(chat =>
                        chat.id === currentChatId
                            ? { ...chat, messages: [...chat.messages, tempUserMessage] }
                            : chat
                    )
                }));

                const response = await sendMessage(parseInt(currentChatId), messageToSend);

                const assistantMessage: Message = {
                    id: `assistant-${Date.now()}`,
                    content: response.answer,
                    role: 'assistant',
                    timestamp: new Date()
                };

                set(state => ({
                    chats: state.chats.map(chat =>
                        chat.id === currentChatId
                            ? { ...chat, messages: [...chat.messages, assistantMessage] }
                            : chat
                    ),
                    isLoading: false
                }));
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Не удалось отправить сообщение');
            set({ isLoading: false });
        }
    },

    setCurrentChat: (id) => set({ currentChatId: id }),

    toggleHistory: () => set((state) => ({ isHistoryOpen: !state.isHistoryOpen })),

    createNewChat: () => set({ currentChatId: null })
}));