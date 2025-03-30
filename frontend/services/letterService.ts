import api from "./api";

export interface LetterRequest {
    letterType: 'motivational' | 'recommendation';
    program: string;
    subjects: string;
    achievements: string;
    skills: string;
    goals: string;
}

export interface Letter {
    id: string;
    letter_type: 'motivational' | 'recommendation';
    program: string;
    subjects: string;
    achievements: string;
    skills: string;
    goals: string;
    content: string;
    created_at: string;
    updated_at: string;
}

/**
 * Generate a new letter based on form data
 */
export const generateLetter = async (data: LetterRequest): Promise<{ id: number; content: string }> => {
    const response = await api.post('/api/generate/letter', data);
    return response.data;
}

/**
 * Get a letter by ID
 */
export const getLetterById = async (id: string): Promise<Letter> => {
    const response = await api.get(`/api/letters/${id}`);
    return response.data;
}

/**
 * Get all letters for the current user
 */
export const getUserLetters = async (): Promise<Letter[]> => {
    const response = await api.get('/api/letters');
    return response.data;
}