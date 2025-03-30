import { setCookie, parseCookies, destroyCookie } from 'nookies';
import api from './api';

const TOKEN_COOKIE_NAME = 'uni_auth_token';
const COOKIE_OPTIONS = {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
}

export interface SignupData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirm_password: string;
    telephone?: string;
    city: string;
    gender: string;
}

export const signup = async (userData: SignupData) => {
    const response = await api.post('/signup', userData);
    return response.data;
}

export const login = async (username: string, password: string) => {
    const response = await api.post('/login', { username, password });

    if (response.data.token) {
        setCookie(null, TOKEN_COOKIE_NAME, response.data.token, COOKIE_OPTIONS);
    }

    return response.data;
}

export const getUserInfo = async () => {
    const response = await api.get('/user/me');
    return response.data;
}

export const logout = () => {
    destroyCookie(null, TOKEN_COOKIE_NAME, { path: '/' });
}

export const getToken = () => {
    const cookies = parseCookies();
    return cookies[TOKEN_COOKIE_NAME];
}