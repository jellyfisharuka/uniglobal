import api from './api';

export interface UserProfile {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    telephone: string;
    gender: string;
    city: string;
}

export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    city?: string;
    email?: string;
    telephone?: string;
    username?: string;
    gender?: string;
}

export interface ChangePasswordData {
    old_password: string;
    new_password: string;
    confirm_password: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await api.get('/user/me');
    return response.data;
};

export const updateUserProfile = async (data: UpdateUserData) => {
    // Convert to snake_case for backend
    const backendData = {
        firstname: data.firstName,
        lastname: data.lastName,
        city: data.city,
        email: data.email,
        telephone: data.telephone,
        username: data.username,
        gender: data.gender
    };

    // Only include fields that are defined
    const cleanedData = Object.fromEntries(
        Object.entries(backendData).filter(([, v]) => v !== undefined)
    );

    const response = await api.put('/user/updateInfo', cleanedData);
    return response.data;
};

export const changePassword = async (data: ChangePasswordData) => {
    const response = await api.put('/user/change_password', data);
    return response.data;
};