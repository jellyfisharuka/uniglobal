import { ApiMessage } from '@/lib/chat-utils';
import api from './api';

export interface Chat {
    id: number;
    user_id: number;
    messages: ApiMessage[];
}

export const getUserChats = async (): Promise<Chat[]> => {
    const response = await api.get('/userchats');
    return response.data;
}

export const getChat = async (chatId: number): Promise<Chat> => {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
}

export const createChat = async (): Promise<Chat> => {
    const response = await api.post('/chats', {});
    return response.data;
}

export const sendMessage = async (chatId: number, prompt: string): Promise<ApiMessage> => {
    const response = await api.post(`/chats/${chatId}/messages`, {
        chat_id: chatId,
        prompt: prompt
    });
    return response.data;
}

export const deleteChat = async (chatId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/chats/${chatId}`);
    return response.data;
}

export async function toggleLikeMessage(message_id: number) {
    const response = await api.put(`/messages/like`, { message_id });
    return response.data;
}

export async function getFavoriteMessages() {
    const response = await api.get(`/favorites`);
    return response.data;
}